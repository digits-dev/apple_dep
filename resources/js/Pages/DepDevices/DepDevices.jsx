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
import Tbody from "../../Components/Table/Tbody";
import { useToast } from "../../Context/ToastContext";

const DepDevices = ({ devices, queryParams }) => {
    queryParams = queryParams || {};

    const { handleToast } = useToast();


	const [loading, setLoading] = useState(false);

	router.on("start", () => setLoading(true));
	router.on("finish", () => setLoading(false));

	const [filters, setFilters] = useState({
		item_code: '', 
		item_description: '', 
		serial_number: '', 
		customer_name: '', 
    });

    const handleFilter = (e) => {
        const { name, value } = e.target;
        setFilters(filters => ({
        ...filters,
        [name]: value,
        }));
    }

    const handleFilterSubmit = (e) => {
        e.preventDefault();

        const queryString = new URLSearchParams(filters).toString();
        router.get(`/dep_devices?${queryString}`);
    };

	return (
		<>
        <Head title="DEP Devices" />
        <AppContent>
        
			<ContentPanel>
				<TopPanel>
					<TableSearch queryParams={queryParams} />
					<PerPage queryParams={queryParams} />
						<Filters onSubmit={handleFilterSubmit}>
                            <InputComponent
                                name="item_code"
                                value={filters.item_code}
                                onChange={handleFilter}
                            />
                            <InputComponent
                                name="item_description"
                                value={filters.item_description}
                                onChange={handleFilter}
                            />
                            <InputComponent
                                name="serial_number"
                                value={filters.serial_number}
                                onChange={handleFilter}
                            />
                            <InputComponent
                                name="customer_name"
                                value={filters.customer_name}
                                onChange={handleFilter}
                            />
                        </Filters>
						<Export
                            path={`/dep-devices-export${window.location.search}`}
                            handleToast={handleToast}
                        />
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
					<Tbody data={devices.data}>
						{devices &&
								devices.data.map((item, index) => (
									<Row key={item.serial_number + index} >
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
					</Tbody>
				</TableContainer>

				<Pagination paginate={devices} />
			</ContentPanel>
        </AppContent>
		</>
	);
};

export default DepDevices;
