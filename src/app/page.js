import { ExportTable, ImportTable } from "@/components/sheet.view";
import { ReceberDados } from "./files.model";

export default function Page() {
  return (
    <div>
      <h1>Manipulando dados</h1>
      <div>
        <h2>Exportar tabela</h2>
        <ExportTable />
      </div>
      <div>
        <h2>Importar tabela</h2>
        <ImportTable />
      </div>
    </div>
  );
}
