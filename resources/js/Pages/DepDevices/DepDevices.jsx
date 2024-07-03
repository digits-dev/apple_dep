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

const DepDevices = ({ devices, queryParams }) => {
    queryParams = queryParams || {};

	const [loading, setLoading] = useState(false);

	const [field1, setField1] = useState('');


	router.on("start", () => setLoading(true));
	router.on("finish", () => setLoading(false));

	return (
		<>
        <Head title="DEP Devices" />
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
					<Export  path="/dep-devices-export"/>
				</TopPanel>

				<TableContainer>
					<Thead>
						<Row>
							<TableHeader
								name="item_code"
								queryParams={queryParams}
								width="md"
								justify="center"
                            >
								Item Code
							</TableHeader>

							<TableHeader
								name="item_description"
								queryParams={queryParams}
								width="lg"
                            >
								Item Description
							</TableHeader>

							<TableHeader
								name="serial_number"
								queryParams={queryParams}
                                width="lg"
                                justify="center"
							>
								Serial Number
							</TableHeader>

							<TableHeader
								name="customer_name"
								queryParams={queryParams}
								justify="center"
                                width="lg"
                            >
								Customer Name
							</TableHeader>
						</Row>
					</Thead>

					<tbody>
						{devices &&
							devices.data.map((item) => (
								<Row key={item.sales_order_no} >
									<RowData
										isLoading={loading}
										center
									>
										{item.item_code}
									</RowData>
									<RowData isLoading={loading}>{item.item_description}</RowData>
									<RowData isLoading={loading} center>{item.serial_number}</RowData>
									<RowData isLoading={loading} center>{item.customer_name}</RowData>
							</Row>
							))}
					</tbody>
				</TableContainer>

				<Pagination paginate={devices} />
			</ContentPanel>
        </AppContent>
		</>
	);
};

export default DepDevices;
