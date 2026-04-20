import { useState } from 'react';
import _ from 'lodash';

interface FacetPanelProps {
  items: Record<string, number>;
  filterSpec: Record<string, string[]>;
  itemTitle: string;
  selected: any;
  brush: (title: string, val: string) => void;
  filter: (title: string, val: string) => void;
  clearFilter: () => void;
}

export function FacetPanel({ items, filterSpec, itemTitle, selected, brush, filter, clearFilter }: FacetPanelProps) {
  const [over, setOver] = useState<string | null>(null);
  const [order, setOrder] = useState<string>('count');
  const [orderReverse, setOrderReverse] = useState<string>('desc');

  if (!items || Object.keys(items).length === 0) {
    return <p>Facet Panel is empty.</p>;
  }

  const itemHoveredTags: string[] = selected?.tags?.[itemTitle] ?? [];

  const setOrderBy = (val: string) => {
    let doReverse = 'asc';
    if (order === val) {
      doReverse = orderReverse === 'desc' ? 'asc' : 'desc';
    }
    setOrder(val);
    setOrderReverse(doReverse);
  };

  const mylist = order === 'count'
    ? _.orderBy(_.map(_.keys(items), val => ({ name: val, count: items[val] })), 'count', orderReverse as any)
    : _.orderBy(_.map(_.keys(items), val => ({ name: val, count: items[val] })), 'name', orderReverse as any);

  const dataList = mylist.map((val, i) => {
    const itemName = val.name;
    const itemCount = val.count;
    const theClass = _.includes(itemHoveredTags, itemName) ? 'selected' : '';
    const isOver = itemName === over;
    const rowClass = isOver ? 'myOver' : theClass;
    const filtered = (itemTitle in filterSpec && _.indexOf(filterSpec[itemTitle], itemName) > -1) ? 'x' : '';

    return (
      <tr
        className={rowClass}
        key={`i${i}`}
        onMouseLeave={() => { clearFilter(); setOver(null); }}
        onMouseEnter={() => { brush(itemTitle, itemName); setOver(itemName); }}
        onClick={() => filter(itemTitle, itemName)}
      >
        <td>{filtered}</td>
        <td>{itemName}</td>
        <td>{itemCount}</td>
      </tr>
    );
  });

  return (
    <table className="table table-bordered table-sm table-hover myFacet">
      <thead>
        <tr>
          <th></th>
          <th style={{ cursor: 'pointer' }} onClick={() => setOrderBy('name')}>{itemTitle}</th>
          <th style={{ cursor: 'pointer' }} onClick={() => setOrderBy('count')}>count</th>
        </tr>
      </thead>
      <tbody>
        {dataList}
      </tbody>
    </table>
  );
}

export default FacetPanel;
