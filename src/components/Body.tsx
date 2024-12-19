import React, { useEffect, useState, useRef } from "react";
import { TableDataInterface } from "../types/TableData";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import "../App.css";
import ShimmerEffect from "./ShimmerEffect";

const Body: React.FC = () => {
  const [pagenum, setpagenum] = useState<number>(1);
  const [first, setFirst] = useState<number>(0);
  const [pagetabledata, setpagetabledata] = useState<TableDataInterface[]>([]);
  const [selectedData, setSelectedData] = useState<TableDataInterface[]>([]);
  const [rowsToSelect, setRowsToSelect] = useState<number>(1);
  const overlayRef = useRef<OverlayPanel>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const filterDataResponse = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[],
    page: number
  ): TableDataInterface[] => {
    return data.map((obj) => ({
      id: `${page}-${obj.id}`,
      title: obj.title,
      place_of_origin: obj.place_of_origin,
      artist_display: obj.artist_display,
      inscriptions: obj.inscriptions,
      date_start: obj.date_start,
      date_end: obj.date_end,
    }));
  };

  async function getTableData(page: number) {
    setIsLoading(true);
    const data = await fetch(
      `https://api.artic.edu/api/v1/artworks?page=${page}`
    );
    const json = await data.json();
    setIsLoading(false);
    return filterDataResponse(json?.data, page);
  }

  useEffect(() => {
    (async () => {
      const data = await getTableData(pagenum);
      setpagetabledata(data);
    })();
  }, [pagenum]);

  const onPageChange = (event: { page: number; first: number }) => {
    setpagenum(event.page + 1);
    setFirst(event.first);
  };

  const onSelectionChange = (event: { value: TableDataInterface[] }) => {
    setSelectedData((prevSelectedData) => {
      const currentPageIds = pagetabledata.map((row) => row.id);
      const updatedSelectedData = prevSelectedData.filter(
        (row) => !currentPageIds.includes(row.id)
      );
      const newSelections = event.value.filter(
        (row) =>
          !updatedSelectedData.some((selectedRow) => selectedRow.id === row.id)
      );
      const finalData = [...updatedSelectedData, ...newSelections];
      return finalData;
    });
  };

  const fetchAndSelectRows = async () => {
    setIsLoading(true);
    let totalSelectedRows: TableDataInterface[] = [];
    let currentPage = pagenum;
    while (totalSelectedRows.length < rowsToSelect) {
      const data = await getTableData(currentPage);
      const remainingRowsToSelect = rowsToSelect - totalSelectedRows.length;

      totalSelectedRows = [
        ...totalSelectedRows,
        ...data.slice(0, remainingRowsToSelect),
      ];

      if (totalSelectedRows.length >= rowsToSelect) {
        break;
      }
      currentPage++;
    }

    setSelectedData((prevSelected) => {
      const prevSelectedSet = new Set(prevSelected.map((item) => item.id));
      const combinedSelections = [
        ...prevSelected,
        ...totalSelectedRows.filter((item) => !prevSelectedSet.has(item.id)),
      ];
      return combinedSelections;
    });
    overlayRef.current?.hide();
    setIsLoading(false);
  };

  return (
    <div>
      {isLoading ? (
        <ShimmerEffect />
      ) : (
        <div className="overflow-auto max-w-full max-h-[700px] m-8 border border-gray-300 rounded-lg shadow-md">
          <DataTable
            value={pagetabledata}
            paginator={false}
            rows={12}
            tableStyle={{ minWidth: "100%", maxWidth: "100%" }}
            className="min-w-full font-myfont1"
            selectionMode="checkbox"
            selection={selectedData}
            onSelectionChange={onSelectionChange}
            dataKey="id"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3rem" }}
              bodyStyle={{ textAlign: "center" }}
              headerClassName="bg-slate-200"
              bodyClassName="bg-slate-200"
            ></Column>
            <Column
              field="title"
              header={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    icon="pi pi-angle-down"
                    className="p-button-text p-button-lg focus:outline-none focus:ring-0"
                    onClick={(e) => overlayRef.current?.toggle(e)}
                  />
                  <OverlayPanel
                    ref={overlayRef}
                    className="bg-white rounded-lg shadow-lg p-4 w-80"
                  >
                    <div className="flex flex-col gap-4">
                      <InputNumber
                        id="row-count"
                        placeholder="Select rows..."
                        onValueChange={(e) => setRowsToSelect(e.value || 1)}
                        min={1}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        inputClassName="focus:outline-none focus:ring-0"
                      />
                      <Button
                        label={isLoading ? "Loading..." : "Submit"}
                        onClick={fetchAndSelectRows}
                        disabled={isLoading}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 disabled:cursor-not-allowed"
                      />
                    </div>
                  </OverlayPanel>
                  Title
                </div>
              }
              headerStyle={{
                backgroundColor: "#e2e8f0",
                fontWeight: "bold",
                textAlign: "center",
                padding: "10px",
              }}
              body={(rowData) => (
                <div
                  className="whitespace-normal break-words p-2"
                  title={rowData.title}
                >
                  {rowData.title ? rowData.title : "N/A"}
                </div>
              )}
              bodyStyle={{ borderBottom: "1px solid #e5e7eb", padding: "0" }}
              style={{ width: "25%" }}
            />
            <Column
              field="place_of_origin"
              header="Place Of Origin"
              headerStyle={{
                backgroundColor: "#e2e8f0",
                fontWeight: "bold",
                textAlign: "center",
                padding: "10px",
              }}
              body={(rowData) => (
                <div
                  className="whitespace-normal break-words p-2"
                  title={rowData.place_of_origin}
                >
                  {rowData.place_of_origin ? rowData.place_of_origin : "N/A"}
                </div>
              )}
              bodyStyle={{ borderBottom: "1px solid #e5e7eb", padding: "0" }}
              style={{ width: "25%" }}
            />
            <Column
              field="artist_display"
              header="Artist Display"
              headerStyle={{
                backgroundColor: "#e2e8f0",
                fontWeight: "bold",
                textAlign: "center",
                padding: "10px",
              }}
              body={(rowData) => (
                <div
                  className="whitespace-normal break-words p-2"
                  title={rowData.artist_display}
                >
                  {rowData.artist_display ? rowData.artist_display : "N/A"}
                </div>
              )}
              bodyStyle={{ borderBottom: "1px solid #e5e7eb", padding: "0" }}
              style={{ width: "25%" }}
            />
            <Column
              field="inscriptions"
              header="Inscriptions"
              headerStyle={{
                backgroundColor: "#e2e8f0",
                fontWeight: "bold",
                textAlign: "center",
                padding: "10px",
              }}
              body={(rowData) => (
                <div
                  className="whitespace-normal break-words p-2"
                  title={rowData.inscriptions}
                >
                  {rowData.inscriptions ? rowData.inscriptions : "N/A"}
                </div>
              )}
              bodyStyle={{ borderBottom: "1px solid #e5e7eb", padding: "0" }}
              style={{ width: "25%" }}
            />
            <Column
              field="date_start"
              header="Date Start"
              headerStyle={{
                backgroundColor: "#e2e8f0",
                fontWeight: "bold",
                textAlign: "center",
                padding: "10px",
              }}
              body={(rowData) => (
                <div
                  className="whitespace-normal break-words p-2"
                  title={rowData.date_start}
                >
                  {rowData.date_start ? rowData.date_start : "N/A"}
                </div>
              )}
              bodyStyle={{ borderBottom: "1px solid #e5e7eb", padding: "0" }}
              style={{ width: "25%" }}
            />
            <Column
              field="date_end"
              header="Date End"
              headerStyle={{
                backgroundColor: "#e2e8f0",
                fontWeight: "bold",
                textAlign: "center",
                padding: "10px",
              }}
              body={(rowData) => (
                <div
                  className="whitespace-normal break-words p-2"
                  title={rowData.date_end}
                >
                  {rowData.date_end ? rowData.date_end : "N/A"}
                </div>
              )}
              bodyStyle={{ borderBottom: "1px solid #e5e7eb", padding: "0" }}
              style={{ width: "25%" }}
            />
          </DataTable>
        </div>
      )}
      <Paginator
        first={first}
        rows={12}
        totalRecords={Infinity}
        onPageChange={onPageChange}
        className="m-4 my-paginator flex justify-center"
      />
    </div>
  );
};

export default Body;