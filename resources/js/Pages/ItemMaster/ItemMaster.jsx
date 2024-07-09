import { Head,  router } from "@inertiajs/react";
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
import {  useEffect, useState } from "react";
import { useNavbarContext } from "../../Context/NavbarContext";

const ItemMaster = ({queryParams}) => {
    
    const { setTitle } = useNavbarContext();

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
					<PerPage />
					<Export  path=""/>
				</TopPanel>

				<TableContainer>
					<Thead>
						<Row>
							<TableHeader
								justify="center"
                                sticky="left"
                                sortable={false}
                            >
								Digits Code

							</TableHeader>

							<TableHeader
                                sortable={false}
                            >
                                UPC Code Up
							</TableHeader>

							<TableHeader
                                sortable={false}
                            >
                                UPC Code Up 2
							</TableHeader>

							<TableHeader
                                sortable={false}
                            >
                                UPC Code Up 3
							</TableHeader>

							<TableHeader
                                sortable={false}
                            >
                                UPC Code Up 4
							</TableHeader>

							<TableHeader
                                sortable={false}
                            >
                                UPC Code Up 5
							</TableHeader>

							<TableHeader
                                width="lg"
                                sortable={false}
							>
                                Supplier Item Code
							</TableHeader>

							<TableHeader
                                width="xl"
                                sortable={false}
                            >
								Item Description
							</TableHeader>

							<TableHeader
                                width="xl"
                                sortable={false}
                            >
                                Brand Description
							</TableHeader>


						</Row>
					</Thead>

					<tbody>
						{<Row>
                            <RowData center sticky="left" >0123457</RowData>   
                            <RowData>upc code up1</RowData>   
                            <RowData>upc code up2</RowData>   
                            <RowData>upc code up3</RowData>   
                            <RowData>upc code up4</RowData>   
                            <RowData>upc code up5</RowData>   
                            <RowData>supplier item code123</RowData>   
                            <RowData>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis pariatur </RowData>   
                            <RowData>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Inventore, soluta?</RowData>   
						</Row>}
						{<Row>
                            <RowData center sticky="left" >0123457</RowData>   
                            <RowData>upc code up1</RowData>   
                            <RowData>upc code up2</RowData>   
                            <RowData>upc code up3</RowData>   
                            <RowData>upc code up4</RowData>   
                            <RowData>upc code up5</RowData>   
                            <RowData>supplier item code123</RowData>   
                            <RowData>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis pariatur </RowData>   
                            <RowData>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Inventore, soluta?</RowData>   
						</Row>}
						{<Row>
                            <RowData center sticky="left" >0123457</RowData>   
                            <RowData>upc code up1</RowData>   
                            <RowData>upc code up2</RowData>   
                            <RowData>upc code up3</RowData>   
                            <RowData>upc code up4</RowData>   
                            <RowData>upc code up5</RowData>   
                            <RowData>supplier item code123</RowData>   
                            <RowData>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis pariatur </RowData>   
                            <RowData>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Inventore, soluta?</RowData>   
						</Row>}
					</tbody>
				</TableContainer>

			</ContentPanel>
        </AppContent>
		</>
	);
};


export default ItemMaster;
