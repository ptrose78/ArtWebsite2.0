
export async function ArtsTable({ arts }) {
    
    return (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-200">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-200">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-200">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-200">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-200">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {arts.map((art) => {
                // Ensure price is a valid number, or fallback to "N/A"
                const formattedPrice =
                  art.price && !isNaN(art.price) ? parseFloat(art.price).toFixed(2) : "N/A";
      
                return (
                  <tr key={art.id} className="even:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 border border-gray-200">
                      {art.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border border-gray-200">
                      <img
                        src={art.image_url}
                        alt="Art"
                        className="h-16 w-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border border-gray-200">
                      {formattedPrice}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border border-gray-200">
                      {art.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border border-gray-200">
                      {art.date}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }