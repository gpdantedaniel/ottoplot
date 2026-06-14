import io
import json
import traceback
import contextlib

import numpy as np
import pandas as pd
import scipy
import sklearn

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

globals_dict = {
    "__builtins__": __builtins__,
    "np": np,
    "pd": pd,
    "scipy": scipy,
    "sklearn": sklearn,
    "plt": plt,
}

locals_dict = {}

def main():
    request = json.load(open(0))
    request_id = request.get("id")
    code = request["code"]
    stdout_buffer = io.StringIO()

    try:
        with contextlib.redirect_stdout(stdout_buffer):
            exec(code, globals_dict, locals_dict)
            
        response = {
            "id": request_id,
            "success": True,
            "stdout": stdout_buffer.getvalue(),
            "error": None,
        }

    except Exception:
        response = {
            "id": request_id,
            "success": False,
            "stdout": stdout_buffer.getvalue(),
            "error": traceback.format_exc(),
        }

    print(json.dumps(response))

if __name__ == "__main__":
    main()