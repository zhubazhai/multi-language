import { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { TranslatedTerm } from '@/types';

interface TermsTableProps {
  terms: TranslatedTerm[];
}

export default function TermsTable({ terms }: TermsTableProps) {
  const [gridApi, setGridApi] = useState<any>(null);
  const [gridColumnApi, setGridColumnApi] = useState<any>(null);
  
  // Column definitions
  const columnDefs = useMemo(() => [
    { 
      headerName: "编码", 
      field: "code", 
      width: 200,
      editable: true,
      cellStyle: { fontWeight: '500' }
    },
    { 
      headerName: "类型", 
      field: "type", 
      width: 100,
      editable: true
    },
    { 
      headerName: "分组", 
      field: "group", 
      width: 150,
      editable: true
    },
    { 
      headerName: "中文 (zh_CN)", 
      field: "zh_CN", 
      width: 180,
      editable: true
    },
    { 
      headerName: "繁体 (zh_HK)", 
      field: "zh_HK", 
      width: 180,
      editable: true
    },
    { 
      headerName: "英文 (en_US)", 
      field: "en_US", 
      width: 200,
      editable: true
    }
  ], []);
  
  // Grid options
  const gridOptions = useMemo(() => ({
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
      cellStyle: { padding: '8px 12px' },
      headerClass: 'bg-gray-50 text-gray-700 font-medium'
    },
    rowData: terms,
    rowHeight: 45,
    pagination: true,
    paginationPageSize: 10,
    domLayout: 'autoHeight',
    suppressDragLeaveHidesColumns: true,
    animateRows: true
  }), [terms]);
  
  // Handle grid ready
  const onGridReady = (params: any) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };
  
  // Export to Excel
  const exportToExcel = () => {
    if (!gridApi || terms.length === 0) {
      toast.info('没有可导出的数据');
      return;
    }
    
    try {
      // Prepare data for Excel
      const excelData = terms.map(term => ({
        "编码": term.code,
        "类型": term.type,
        "分组": term.group,
        "中文 (zh_CN)": term.zh_CN,
        "繁体 (zh_HK)": term.zh_HK || "",
        "英文 (en_US)": term.en_US || ""
      }));
      
      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "词条翻译");
      
      // Export the file
      XLSX.writeFile(workbook, "词条翻译结果.xlsx");
      toast.success('Excel导出成功');
    } catch (error) {
      console.error('Excel export error:', error);
      toast.error('导出Excel失败，请重试');
    }
  };
  
  if (terms.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <i className="fa-regular fa-file-alt text-gray-300 text-5xl mb-4"></i>
        <h3 className="text-lg font-medium text-gray-900 mb-1">暂无翻译数据</h3>
        <p className="text-gray-500">请使用上方表单生成翻译词条</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-medium text-gray-900">翻译结果表格</h3>
        <button
          onClick={exportToExcel}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 text-sm"
        >
          <i className="fa-solid fa-file-excel mr-2"></i>
          导出Excel
        </button>
      </div>
      
      <div className="ag-theme-alpine">
        <AgGridReact
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}