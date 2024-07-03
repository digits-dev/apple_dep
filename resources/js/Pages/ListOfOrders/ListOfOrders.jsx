import { Head,  router } from "@inertiajs/react";
import AppContent from "../../Layouts/layout/AppContent";
import Layout from "@/Layouts/layout/layout.jsx";
import TableHeader from "../../Components/Table/TableHeader";
import Pagination from "../../Components/Table/Pagination";
import TableSearch from "../../Components/Table/TableSearch";
import PerPage from "../../Components/Table/PerPage";
import TopPanel from "../../Components/Table/TopPanel";
import ContentPanel from "../../Components/Table/ContentPanel";
import RowData from "../../Components/Table/RowData";
import RowStatus from "../../Components/Table/RowStatus";
import RowAction from "../../Components/Table/RowAction";
import Row from "../../Components/Table/Row";
import Import from "../../Components/Table/Buttons/Import";
import Export from "../../Components/Table/Buttons/Export";
import Filters from "../../Components/Table/Buttons/Filters";
import TableButton from "../../Components/Table/Buttons/TableButton";
import Thead from "../../Components/Table/Thead";
import TableContainer from "../../Components/Table/TableContainer";
import RowActions from "../../Components/Table/RowActions";
import InputComponent from "../../Components/Forms/Input";
import Select from "../../Components/Forms/Select";
import { useState } from "react";


const ListOfOrders = ({ orders, queryParams }) => {
    queryParams = queryParams || {};

	const [loading, setLoading] = useState(false);

	const [field1, setField1] = useState('');


	router.on("start", () => setLoading(true));
	router.on("finish", () => setLoading(false));

	return (
		<>
        <Head title="List of Orders" />
        <AppContent>
        
			<ContentPanel>
				<TopPanel>
					<TableSearch queryParams={queryParams} />
					<PerPage queryParams={queryParams} />
					<Filters>
							<InputComponent name={'field1'} placeholder="placeholder of field1" value={field1} onChange={setField1}/>
							<InputComponent name={'field2'} placeholder="placeholder of field2"/>
							<InputComponent name={'field3'} placeholder="placeholder of field3"/>
							<Select name="first_name" options={[{name:'opt1', id:1}, {name:'opt2', id:2}]} />
							<Select name="middle_name" options={[{name:'opt1', id:1}, {name:'opt2', id:2}]} />
							<Select name="last" options={[{name:'opt1', id:1}, {name:'opt2', id:2}]} />
					</Filters>
					<Export  path="/list-of-orders-export"/>
				</TopPanel>

				<TableContainer>
					<Thead>
						<Row>
							<TableHeader
								name="sales_order_no"
								queryParams={queryParams}
								width="md"
								sticky="left"
								justify="center">
								Sales Order #
							</TableHeader>

							<TableHeader
								name="customer_name"
								queryParams={queryParams}
								width="md">
								Customer Name
							</TableHeader>

							<TableHeader
								name="order_ref_no"
								queryParams={queryParams}
								width="md">
								Order Ref #
							</TableHeader>

							<TableHeader
								name="dep_order"
								queryParams={queryParams}
								justify="center">
								DEP Order
							</TableHeader>

							<TableHeader
								name="enrollment_status"
								queryParams={queryParams}
								justify="center"
							>
								Enrollment Status
							</TableHeader>

							<TableHeader
								name="order_date"
								queryParams={queryParams}>
								Order Date
							</TableHeader>

							<TableHeader
								sortable={false}
								width="auto"
								sticky="right">
								Action
							</TableHeader>
						</Row>
					</Thead>

					<tbody>
						{orders &&
							orders.data.map((item) => (
								<Row key={item.sales_order_no}>
									<RowData
										isLoading={loading}
										center
										sticky="left"
									>
										{item.sales_order_no}
									</RowData>

									<RowData isLoading={loading}>{item.customer_name}</RowData>
									<RowData isLoading={loading}>{item.order_ref_no}</RowData>
									<RowData isLoading={loading} center>{item.dep_order ? 'Yes' : 'No'}</RowData>

                                    <RowStatus
										isLoading={loading}
										status={item.enrollment_status ? "success" : "error"}
										center
									>
										{item.enrollment_status ? "Success" : "Error"}
									</RowStatus>

									<RowData isLoading={loading}>{item.order_date}</RowData>

									<RowData
										isLoading={loading}
										sticky="right"
										center>

										<RowActions>
											<RowAction
												action="view"
												size="md"
											/>
											<RowAction
												action="edit"
												size="md"
											/>
										</RowActions>
									</RowData>
								</Row>
							))}
					</tbody>
				</TableContainer>

				<Pagination paginate={orders} />
			</ContentPanel>
        </AppContent>
		</>
	);
};

export default ListOfOrders;
