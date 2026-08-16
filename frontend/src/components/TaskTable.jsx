import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function TaskTable({
  tableState = {
    columns: [],
    data: [],
    actions: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    loading: false,
  },

  setTableState,

  showView = true,
  showUpdate = true,
  showDelete = true,
}) {
  const {
    columns = [],
    data = [],
    actions = [],
    pagination = {},
    loading = false,
  } = tableState;

  const location = useLocation();

  const navigate = useNavigate();

  const { page = 1, limit = 10, total = 0, totalPages = 0 } = pagination;

  const normalizedColumns = columns.map((column) => ({
    key: column.key || column.field || column.name,
    label: column.label || column.header || column.title || column.name,
    render: column.render,
  }));

  const hasActions = actions.length > 0 || showView || showUpdate || showDelete;

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const currentPageData = data.slice(startIndex, endIndex);

  const start = total === 0 ? 0 : startIndex + 1;
  const end = Math.min(endIndex, total);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    setTableState((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        page: newPage,
      },
    }));
  };

  const handleLimitChange = (newLimit) => {
    const newTotalPages = Math.ceil(total / newLimit);

    setTableState((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        page: 1,
        limit: newLimit,
        totalPages: newTotalPages,
      },
    }));
  };

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          {/* Header */}
          <thead className="bg-gray-50">
            <tr>
              {normalizedColumns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-sm font-semibold text-gray-600"
                >
                  {column.label}
                </th>
              ))}

              {hasActions && (
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-200">
            {/* Loading */}
            {loading ? (
              <tr>
                <td
                  colSpan={normalizedColumns.length + (hasActions ? 1 : 0)}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : currentPageData.length > 0 ? (
              currentPageData.map((row, rowIndex) => (
                <tr
                  key={row.id ?? rowIndex}
                  className="transition hover:bg-gray-50"
                >
                  {/* Data columns */}
                  {normalizedColumns.map((column) => {
                    const value = row[column.key];

                    return (
                      <td
                        key={column.key}
                        className="px-6 py-4 text-sm text-gray-700"
                      >
                        {column.render
                          ? column.render(value, row)
                          : (value ?? "-")}
                      </td>
                    );
                  })}

                  {/* Actions */}
                  {hasActions && (
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {showView && (
                          <button
                            onClick={() =>
                              navigate(`${location.pathname}/task/view/${row.id}`)
                            }
                            className="rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
                          >
                            View
                          </button>
                        )}

                        {showUpdate && (
                          <button
                            onClick={() =>
                              navigate(
                                `${location.pathname}/task/update/${row.id}`,
                              )
                            }
                            className="rounded-lg bg-yellow-100 px-3 py-1.5 text-sm font-medium text-yellow-700 hover:bg-yellow-200"
                          >
                            Update
                          </button>
                        )}

                        {showDelete && (
                          <button
                            onClick={() =>
                              navigate(
                                `${location.pathname}/task/delete/${row.id}`,
                              )
                            }
                            className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              /* No data */
              <tr>
                <td
                  colSpan={normalizedColumns.length + (hasActions ? 1 : 0)}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex flex-col gap-4 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-700">{start}</span>{" "}
              to <span className="font-medium text-gray-700">{end}</span>
            </p>

            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium ${
                    page === pageNumber
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {pageNumber}
                </button>
              ),
            )}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
