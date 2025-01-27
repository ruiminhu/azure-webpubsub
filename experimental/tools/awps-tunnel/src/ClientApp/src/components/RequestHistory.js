import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import moment from 'moment';
import { ReadonlyTabs } from './Tabs';
import { ResizablePanel } from './ResizablePanel';
export function RequestHistory({ connection }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchParams] = useSearchParams();
  const detailId = parseInt(searchParams.get("detailId"));
  useEffect(() => {
    async function fetchData() {
      // loading history data
      const response = await fetch('httphistory');
      const data = await response.json();

      setLoading(false);
      setItems(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      return;
    }
    if (detailId !== undefined && detailId >= 0) {
      var selected = items.find(s => s.id === detailId);
      if (selected) {
        setSelectedItem(selected);
      }
    }
  }, [items, selectedItem, detailId])

  useEffect(() => {
    if (connection) {
      connection.on('updateData', (newItem) => {
        setItems(prevState =>
          [{ ...newItem, unread: true }, ...prevState]);
      });
    }
  }, [connection]);
  const overviewPanel = (<table className='table' aria-labelledby="tabelLabel">
    <tbody>
      {
        items.map(item =>
          <tr key={item.id}
            className={item.unread ? 'unread' :
              (item === selectedItem ? 'active' : '')}
            onClick={() => { item.unread = false; setSelectedItem(item); }}>
            <td>{moment(item.requestAtOffset).fromNow()}</td>
            <td className={item.code < 300 ? "text-success" : "text-warning"}><b>{item.methodName}</b></td>
            <td>{item.url}</td>
            <td>{item.code}</td>
          </tr>
        )}
    </tbody>
  </table>);
  const detailPanel = <Details item={selectedItem}></Details>;
  return (<div className="d-flex flex-row server-container overflow-auto">
    <div className="table-container flex-fill d-flex flex-column">
      <h5>History</h5>
      {
        loading ?
          (
            <p><em>Loading...</em></p>
          ) : (<ResizablePanel left={overviewPanel} right={detailPanel}></ResizablePanel>)}
    </div>
  </div>);
}

function Details({ item }) {
  if (!item) return <></>;
  let requestTabItems = [
    {
      title: "Request Details",
      content:
        <div className="m-2" style={{ whiteSpace: 'pre-wrap' }}>{item.requestRaw}</div>
    }
  ];
  let responseTabItems = [
    {
      title: "Response Details",
      content:
        <div className="m-2" style={{ whiteSpace: 'pre-wrap' }}>{item.responseRaw}</div>
    }
  ];
  return (
    <div className="panel-container d-flex flex-column flex-fill">
      <div className="banner d-flex">
        <span>{moment(item.requestAtOffset).fromNow()}</span>
      </div>
      <div className="request">
        <h5>{item.methodName} {item.url}</h5>
        <ReadonlyTabs items={requestTabItems}></ReadonlyTabs>
      </div>
      <div className="response">
        <h5 className={item.code < 300 ? "text-success" : "text-warning"}>{item.code}</h5>
        <ReadonlyTabs items={responseTabItems}></ReadonlyTabs>
      </div>

    </div>
  );
}