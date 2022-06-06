import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Collapse } from "antd";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import moment from "moment";

const { Panel } = Collapse;
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StyledLayout = styled.div`
  margin-top: 15px;
`;

const StyledCollaped = styled(Collapse)`
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;

  .ant-collapse-item {
    .ant-collapse-header {
      font-weight: bold;
      font-size: 1rem;
    }

    .ant-collapse-content {
      border-radius: 0 0 10px 10px;
    }
  }
`;

const AssetPriceChart = () => {
  const asset = useSelector((state) => state.asset);
  const [chartData, setChartData] = useState(undefined);

  useEffect(() => {
    if (asset) {
      const data = {
        labels: asset.prevPrice.map((price) =>
          moment(price.updatedAt).format("M/D")
        ),
        datasets: [
          {
            label: "Price in ETH",
            data: asset.prevPrice.map((price) => price.price),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            cubicInterpolationMode: "monotone",
            tension: 0.4,
          },
        ],
      };

      setChartData(data);
    }
  }, [asset]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      scales: {
        x: {
          type: "linear",
        },
      },
    },
  };

  return (
    <StyledLayout>
      <StyledCollaped
        defaultActiveKey={asset.status != "On Auction" && ["1"]}
        expandIconPosition="right"
      >
        <Panel header="Price History" key="1">
          {asset.prevPrice.length !== 0 ? (
            chartData && <Line data={chartData} options={options} />
          ) : (
            <p>There is no price history yet</p>
          )}
        </Panel>
      </StyledCollaped>
    </StyledLayout>
  );
};

export default AssetPriceChart;
