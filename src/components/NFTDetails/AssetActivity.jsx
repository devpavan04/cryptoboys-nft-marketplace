import React, { useState } from "react";
import styled from "styled-components";
import { Collapse,Table } from "antd";
import Icon,{FireOutlined,DollarOutlined } from '@ant-design/icons';
import { ReactComponent as Ethereum } from "../../assets/icons/ethereum.svg";



const { Panel } = Collapse;

const StyledLayout = styled.div`
  margin-top: 15px;
  width: 100%;
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

const StyledIcon = styled(Icon)`
position: relative;
top: -3px;
`

const EthereumIcon = (props) => <Icon component={Ethereum} {...props} />;

const columns = [
  {
    title: 'Event',
    dataIndex: 'event',
    key: 'event',
    render: text => {
      return (
        <span>
          {text==="Sale" ? 
            <StyledIcon component={DollarOutlined} style={{color:"green"}}/> 
            : <StyledIcon component={FireOutlined}  style={{color:"red"}}/> 
          }
          {" "}
          {text}
        </span>
      )
    },
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render : price => {
      return (
        <div>
          {price!==0 && (
            <span>
              <EthereumIcon
                style={{
                  fontSize: "18px",
                  position: "relative",
                  top: "-3px",
                  marginRight: "1px",
                }}
              />
              {price}
            </span>
          )}
        </div>
      )
    }
  },
  {
    title: 'From',
    dataIndex: 'from',
    key: 'from',
    render: (text) => <a>{text}</a>
  },
  {
    title: 'To',
    key: 'to',
    dataIndex: 'to',
    render: (text) => <a>{text}</a>
  },
  {
    title: 'Date',
    key: 'date',
    dataIndex: 'date',
  },
]

const data = [
  {
    key: '1',
    event: 'Mint',
    price: 0,
    from: '0x000000',
    to: '0x000000',
    date: '2020-01-01',
  },
  {
    key: '2',
    event: 'Sale',
    price: 0.55,
    from: '0x000000',
    to: '0x000000',
    date: '2020-01-01',
  },
  {
    key: '3',
    event: 'Sale',
    price: 0.68,
    from: '0x000000',
    to: '0x000000',
    date: '2020-01-01',
  },
  {
    key: '4',
    event: 'Sale',
    price: 0.68,
    from: '0x000000',
    to: '0x000000',
    date: '2020-01-01',
  },
  {
    key: '5',
    event: 'Sale',
    price: 0.68,
    from: '0x000000',
    to: '0x000000',
    date: '2020-01-01',
  },
  {
    key: '6',
    event: 'Sale',
    price: 0.68,
    from: '0x000000',
    to: '0x000000',
    date: '2020-01-01',
  },
  {
    key: '7',
    event: 'Sale',
    price: 0.68,
    from: '0x000000',
    to: '0x000000',
    date: '2020-01-01',
  },
];

const AssetActivity = () => {
  const [description, setDescription] = useState("");
  return (
    <StyledLayout>
      <StyledCollaped defaultActiveKey={['1']} expandIconPosition="right">
        <Panel header="Asset Activities" key="1">
          <Table columns={columns} dataSource={data} 
            pagination={{position:["none","none"]}} scroll={{y:200}}
          />
        </Panel>
      </StyledCollaped>
    </StyledLayout>
  );
};

export default AssetActivity;
