import React, { useEffect, useState } from "react";
import ContentPanel from "../Table/ContentPanel";
import Chart from "react-apexcharts";

const Orders = ({ orders_count_wdate }) => {
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: "line",
            height: 350,
        },
        stroke: {
            curve: "smooth",
            width: 3,
        },
        markers: {
            size: 5,
        },
        xaxis: {
            type: "datetime",
            categories: [],
        },
        colors: ["#595757"],
    });

    const [chartSeries, setChartSeries] = useState([
        {
            type: "area",
            name: "Orders",
            data: [],
        },
    ]);

    useEffect(() => {
        if (orders_count_wdate && orders_count_wdate.length > 0) {
            const dates = orders_count_wdate.map((order) => order.date);
            const counts = orders_count_wdate.map((order) => order.count);

            setChartOptions((prevOptions) => ({
                ...prevOptions,
                xaxis: {
                    ...prevOptions.xaxis,
                    categories: dates,
                },
            }));

            setChartSeries([
                {
                    type: "area",
                    name: "Orders",
                    data: counts,
                },
            ]);
        }
    }, [orders_count_wdate]);

    return (
        <>
            <ContentPanel marginBottom={0}>
                <p className="font-extrabold font-nunito-sans mb-3">Orders</p>

                <Chart
                    options={chartOptions}
                    series={chartSeries}
                    height={350}
                />
            </ContentPanel>
        </>
    );
};

export default Orders;
