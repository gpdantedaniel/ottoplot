import io
import json
import traceback
import contextlib
import numpy as np
import pandas as pd
import matplotlib
import matplotlib.pyplot as plt

matplotlib.use("Agg")

globals_dict = {
    "__builtins__": __builtins__,
    "np": np,
    "pd": pd,
    "plt": plt,
}

def main():
    request = json.load(open(0))
    request_id = request.get("id")
    code = request["code"]
    stdout_buffer = io.StringIO()

    try:
        with contextlib.redirect_stdout(stdout_buffer):
            exec(code, globals_dict, {})
            
        response = {
            "id": request_id,
            "success": True,
            "stdout": stdout_buffer.getvalue(),
            "error": None
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