"use client";

import { useState } from "react";
import data from "@/data/data.json";
import { read, utils, writeFile } from "xlsx";

export function ExportTable() {
  const [rows, setRows] = useState([]);
  async function buildTable() {
    const dados = data;
    const valids = dados.filter((row) => row.hsvalidity_products.length > 0);
    valids.map((row) => {
      row.created_at = new Date(row.created_at).toLocaleDateString("pt-BR");
      row.modified_at = new Date(row.modified_at).toLocaleDateString("pt-BR");
      row.hsvalidity_products.map((subRow) => {
        subRow.validity_date = new Date(subRow.validity_date).toLocaleDateString("pt-BR");
        subRow.treat_id =
          subRow.treat_id === 1
            ? "Pendente"
            : subRow.treat_id === 2
            ? "Colocar em promoção"
            : subRow.treat_id === 3
            ? "Troca com o fornecedor"
            : subRow.treat_id === 4
            ? "Transferência interna"
            : subRow.treat_id === 5
            ? "Bloqueio para venda"
            : subRow.treat_id === 6
            ? "Doação"
            : subRow.treat_id === 7
            ? "Vencido"
            : subRow.treat_id === 8
            ? "Produção vendável dentro do prazo"
            : subRow.treat_id === 9
            ? "Inserção tardia"
            : "Tipo inválido";
      });
    });
    const products = valids.flatMap((item) =>
      item.hsvalidity_products.map((prod) => ({
        validity_id: prod.validity_id,
        branch_id: item.branch_id,
        created_at: item.created_at,
        modified_at: item.modified_at,
        request_id: item.request_id,
        employee_id: item.employee_id,
        prod_id: prod.id,
        product_cod: prod.product_cod,
        auxiliary_code: prod.auxiliary_code,
        description: prod.description,
        quantity: prod.quantity,
        validity_date: prod.validity_date,
        treat_id: prod.treat_id,
      }))
    );
    let firstDate = products[0].validity_date;
    let lastDate = products[products.length - 1].validity_date;
    const worksheet = utils.json_to_sheet(products);
    const workbook = utils.book_new();
    firstDate = firstDate.replaceAll("/", "-");
    lastDate = lastDate.replaceAll("/", "-");
    const sheetName = `Validade ${firstDate} ${lastDate}`;
    utils.book_append_sheet(workbook, worksheet, "Validade");
    writeFile(workbook, `${sheetName}.xlsx`, { compression: true });
    console.log(products);
    // const responseResult = await fetch("https://docs.sheetjs.com/executive.json");
    // const responseValue = await responseResult.json();
    // const prez = responseValue.filter((row) => row.terms.some((term) => term.type === "prez"));
    // prez.forEach((row) => (row.start = row.terms.find((term) => term.type === "prez").start));
    // prez.sort((l, r) => l.start.localeCompare(r.start));
    // const rows = prez.map((row) => ({
    //   name: `${row.name.first} ${row.name.last}`,
    //   birthday: row.bio.birthday,
    // }));
    // const worksheet = utils.json_to_sheet(rows);
    // const workbook = utils.book_new();
    // utils.book_append_sheet(workbook, worksheet, "Dates");
    // setRows(rows);
  }
  return (
    <div>
      {/* {rows.length > 0 && (
        <table className="mt-6 border-collapse border border-gray-400 w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400">Nome</th>
              <th className="border border-gray-400">Data de Nascimento</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-400 px-4 py-2">{row.name}</td>
                <td className="border border-gray-400 px-4 py-2">{row.birthday}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )} */}
      <button onClick={buildTable}>Download dos dados</button>
    </div>
  );
}

export function ImportTable() {
  const [__html, setHtml] = useState("");
  const [table, setTable] = useState([]);
  const [tableKey, setTableKey] = useState(0);

  async function readTable(data) {
    const buffer = await data.arrayBuffer();
    const workbook = read(buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const raw_data = utils.sheet_to_json(worksheet, { header: 1 });
    const rows = raw_data.filter((r) => typeof r[0] === "number");
    const objects = rows.map((r) => ({
      validity_id: r[0],
      branch_id: r[1],
      prod_id: r[6],
      product_cod: r[7],
      auxiliary_code: r[8],
      description: r[9],
      quantity: r[10],
      validity_date: r[11],
      treat_id: r[12],
    }));
    rows.map((row) => {
      row[12] =
        row[12] === "Pendente"
          ? 1
          : row[12] === "Colocar em promoção"
          ? 2
          : row[12] === "Troca com o fornecedor"
          ? 3
          : row[12] === "Transferência interna"
          ? 4
          : row[12] === "Bloqueio para venda"
          ? 5
          : row[12] === "Doação"
          ? 6
          : row[12] === "Vencido"
          ? 7
          : row[12] === "Produto vendável dentro do prazo"
          ? 8
          : row[12] === "Inserção tardia"
          ? 9
          : "Tipo inválido";
    });

    setTable(objects);
    setTableKey((prev) => prev + 1);

    console.log(objects);
    console.log(rows);
    // const url = "https://docs.sheetjs.com/PortfolioSummary.xls";
    // const file = await (await fetch(url)).arrayBuffer();
    // const workbook = read(file, { sheetRows: 20 });
    // const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // const table = utils.sheet_to_html(worksheet);
    // const raw_data = utils.sheet_to_json(worksheet, { header: 1 });
    // let last_year = 0;
    // raw_data.forEach((r) => (last_year = r[0] = r[0] != null ? r[0] : last_year));
    // const rows = raw_data.filter((r) => r[0] >= 2007 && r[0] <= 2029 && r[2] > 0);
    // const objects = rows.map((r) => ({ FY: r[0], FQ: r[1], total: r[8] }));

    // setTable(objects);
    // console.log(objects);
  }

  return (
    <div>
      <form>
        <label htmlFor="files">{tableKey}</label>
        <input
          id="files"
          name="files"
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) readTable(file);
            e.target.value = "";
          }}
        />
        {/* <button
          onClick={(e) => {
            e.preventDefault();
            readTable();
          }}
        >
          Gerar tabela
        </button> */}
      </form>
      {__html && <div dangerouslySetInnerHTML={{ __html }} />}
      {table.length > 0 && (
        <table key={tableKey}>
          <thead>
            <tr>
              <th>ID Validade</th>
              <th>Filial</th>
              <th>ID Prod</th>
              <th>Cod Prod</th>
              <th>Cod Barras</th>
              <th>Desc</th>
              <th>Quant</th>
              <th>DT Validade</th>
              <th>Tratativa</th>
            </tr>
          </thead>
          <tbody>
            {table.map((o, R) => (
              <tr key={R}>
                <td>{o.validity_id}</td>
                <td>{o.branch_id}</td>
                <td>{o.prod_id}</td>
                <td>{o.product_cod}</td>
                <td>{o.auxiliary_code}</td>
                <td>{o.description}</td>
                <td>{o.quantity}</td>
                <td>{o.validity_date}</td>
                <td>{o.treat_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
