import Papa from "papaparse"
import { useEffect, useMemo, useState } from "react"
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

export function CsvTableViewer({ refreshKey }) {
  const [tables, setTables] = useState([])
  const [selectedTableId, setSelectedTableId] = useState("")
  const [rows, setRows] = useState([])
  const [fields, setFields] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const loadTables = async () => {
    const result = await window.api.listTables()
    setTables(result ?? [])

    if (result?.length > 0) {
      setSelectedTableId((current) => current || result[0].id)
    }
  }

  useEffect(() => {
    loadTables()
  }, [refreshKey])

  useEffect(() => {
    if (!selectedTableId) {
      setRows([])
      setFields([])
      return
    }

    const loadSelectedTable = async () => {
      setLoading(true)
      setErrorMessage("")

      try {
        const csvText = await window.api.readTable(selectedTableId)

        const parsed = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        })

        if (parsed.errors?.length > 0) {
          console.warn("CSV parse warnings:", parsed.errors)
        }

        setFields(parsed.meta.fields ?? [])
        setRows(parsed.data ?? [])
      } catch (error) {
        console.error(error)
        setErrorMessage(error?.message ?? "Failed to load CSV table.")
        setRows([])
        setFields([])
      } finally {
        setLoading(false)
      }
    }

    loadSelectedTable()
  }, [selectedTableId])

  const columns = useMemo(() => {
    return fields.map((field) => ({
      accessorKey: field,
      header: field || "(empty column)",
      cell: ({ getValue }) => {
        const value = getValue()
        return value === null || value === undefined ? "" : String(value)
      },
    }))
  }, [fields])

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 30,
      },
    },
  })

  const handleDownload = async () => {
    if (!selectedTableId) return
    await window.api.downloadTable(selectedTableId)
  }

  if (tables.length === 0) {
    return (
      <div>
        &gt; Awaiting generated tables...
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="flex flex-row items-center gap-2">
        <select
          className="border rounded-md px-3 py-2 text-sm max-w-[360px]"
          value={selectedTableId}
          onChange={(event) => setSelectedTableId(event.target.value)}
        >
          {tables.map((tableFile) => (
            <option key={tableFile.id} value={tableFile.id}>
              {tableFile.name}
            </option>
          ))}
        </select>

        <Button
          type="button"
          onClick={handleDownload}
          disabled={!selectedTableId}
        >
          Download CSV
        </Button>

        <Button
          type="button"
          onClick={loadTables}
        >
          Refresh
        </Button>
      </div>

      {loading && (
        <p className="text-sm">&gt; Loading table...</p>
      )}

      {errorMessage && (
        <p className="text-sm text-red-500">&gt; {errorMessage}</p>
      )}

      {!loading && rows.length > 0 && (
        <>
          <div className="text-sm">
            Showing {table.getRowModel().rows.length} rows on this page. Total rows: {rows.length}.
          </div>

          <div className="border rounded-md overflow-auto max-h-[520px] w-full">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 z-1 bg-background text-black border-b border-b-white">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="border-b border-r px-3 py-2 text-left font-semibold whitespace-nowrap"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="border-b border-r px-3 py-2 whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-row items-center gap-2">
            <Button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>

            <span className="text-sm">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>

            <Button
              type="button"

              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </>
      )}

      {!loading && selectedTableId && rows.length === 0 && !errorMessage && (
        <p className="text-sm">&gt; Table is empty.</p>
      )}
    </div>
  )
}