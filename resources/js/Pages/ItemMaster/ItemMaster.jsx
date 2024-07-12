import { Head, router } from "@inertiajs/react";
import AppContent from "../../Layouts/layout/AppContent";
import TableHeader from "../../Components/Table/TableHeader";
import TableSearch from "../../Components/Table/TableSearch";
import PerPage from "../../Components/Table/PerPage";
import TopPanel from "../../Components/Table/TopPanel";
import ContentPanel from "../../Components/Table/ContentPanel";
import RowData from "../../Components/Table/RowData";
import Row from "../../Components/Table/Row";
import Export from "../../Components/Table/Buttons/Export";
import Thead from "../../Components/Table/Thead";
import TableContainer from "../../Components/Table/TableContainer";
import { useEffect, useState } from "react";
import { useNavbarContext } from "../../Context/NavbarContext";
import Pagination from "../../Components/Table/Pagination";
import Tbody from "../../Components/Table/Tbody";

const ItemMaster = ({ itemMaster, queryParams }) => {
    const { setTitle } = useNavbarContext();
    const [loading, setLoading] = useState(false);

    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    useEffect(() => {
        setTimeout(() => {
            setTitle("Submaster - Item Master");
        }, 5);
    }, []);

    return (
        <>
            <Head title="Item Master" />
            <AppContent>
                <ContentPanel>
                    <TopPanel>
                        <TableSearch queryParams={queryParams} />
                        <PerPage queryParams={queryParams} />
                        <Export path="" />
                    </TopPanel>

                    <TableContainer>
                        <Thead>
                            <Row>
                                <TableHeader
                                    sticky="left"
                                    name="digits_code"
                                    queryParams={queryParams}
                                >
                                    Digits Code
                                </TableHeader>

                                <TableHeader
                                    name="upc_code_up_1"
                                    queryParams={queryParams}
                                    width="lg"
                                >
                                    UPC Code Up
                                </TableHeader>

                                <TableHeader
                                    name="upc_code_up_2"
                                    width="lg"
                                    queryParams={queryParams}
                                >
                                    UPC Code Up 2
                                </TableHeader>

                                <TableHeader
                                    name="upc_code_up_3"
                                    width="lg"
                                    queryParams={queryParams}
                                >
                                    UPC Code Up 3
                                </TableHeader>

                                <TableHeader
                                    name="upc_code_up_4"
                                    width="lg"
                                    queryParams={queryParams}
                                >
                                    UPC Code Up 4
                                </TableHeader>

                                <TableHeader
                                    name="upc_code_up_5"
                                    width="lg"
                                    queryParams={queryParams}
                                >
                                    UPC Code Up 5
                                </TableHeader>

                                <TableHeader
                                    name="wh_category"
                                    width="lg"
                                    queryParams={queryParams}
                                >
                                    WH Category
                                </TableHeader>

                                <TableHeader
                                    width="lg"
                                    name="supplier_item_code"
                                    queryParams={queryParams}
                                >
                                    Supplier Item Code
                                </TableHeader>

                                <TableHeader
                                    width="xl"
                                    name="item_description"
                                    queryParams={queryParams}
                                >
                                    Item Description
                                </TableHeader>

                                <TableHeader
                                    width="xl"
                                    name="brand_description"
                                    queryParams={queryParams}
                                >
                                    Brand Description
                                </TableHeader>
                            </Row>
                        </Thead>
                        <Tbody data={itemMaster.data}>
                            {itemMaster &&
                                itemMaster.data.map((item) => (
                                    <Row key={item.id}>
                                        <RowData
                                            sticky="left"
                                            isLoading={loading}
                                        >
                                            {item.digits_code}
                                        </RowData>

                                        <RowData isLoading={loading}>
                                            {item.upc_code_up_1}
                                        </RowData>

                                        <RowData isLoading={loading}>
                                            {item.upc_code_up_2}
                                        </RowData>

                                        <RowData isLoading={loading}>
                                            {item.upc_code_up_3}
                                        </RowData>

                                        <RowData isLoading={loading}>
                                            {item.upc_code_up_4}
                                        </RowData>

                                        <RowData isLoading={loading}>
                                            {item.upc_code_up_5}
                                        </RowData>

                                        <RowData isLoading={loading}>
                                            {item.wh_category}
                                        </RowData>

                                        <RowData isLoading={loading}>
                                            {item.supplier_item_code}
                                        </RowData>

                                        <RowData isLoading={loading}>
                                            {item.item_description}
                                        </RowData>

                                        <RowData isLoading={loading}>
                                            {item.brand_description}
                                        </RowData>
                                    </Row>
                                ))}
                        </Tbody>
                    </TableContainer>
                    <Pagination paginate={itemMaster} />
                </ContentPanel>
            </AppContent>
        </>
    );
};

export default ItemMaster;
