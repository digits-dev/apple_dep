import React, { useState } from "react";
import ContentPanel from "../Table/ContentPanel";
import Chart from "react-apexcharts";

const Orders = () => {
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
            categories: [
                "2024-01-01",
                "2024-02-01",
                "2024-02-05",
                "2024-03-01",
                "2024-04-01",
                "2024-05-01",
                "2024-06-01",
                "2024-07-01",
            ],
        },
        colors: ["#595757"],
    });

    const [chartSeries, setChartSeries] = useState([
        {
            type: "area",
            name: "Orders",
            data: [30, 40, 35, 50, 49, 70, 80, 1000],
        },
    ]);

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
