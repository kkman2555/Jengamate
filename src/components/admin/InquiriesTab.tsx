
import React, { useMemo, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Inquiry } from '@/types/admin';
import { Download, ListCheck } from 'lucide-react';

interface InquiriesTabProps {
  inquiries: Inquiry[];
  onRefresh: () => void;
}

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Quoted: 'bg-blue-100 text-blue-800',
  Accepted: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800'
};

function toCSV(rows: any[], columns: any[]) {
  const escapeCSV = (val: any) =>
    `"${String(val ?? '').replace(/"/g, '""')}"`;

  const header = columns.map((c) => escapeCSV(c.header)).join(',');
  const body = rows
    .map((row) =>
      columns
        .map((col) =>
          escapeCSV(col.cell ? col.cell(row) : row[col.accessorKey])
        )
        .join(',')
    )
    .join('\n');
  return header + '\n' + body;
}

const InquiriesTab = ({ inquiries, onRefresh }: InquiriesTabProps) => {
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean, visibleRows: Inquiry[]) => {
    if (checked) {
      setSelectedIds(visibleRows.map(row => row.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (checked: boolean, rowId: string) => {
    setSelectedIds((ids) =>
      checked ? [...ids, rowId] : ids.filter((id) => id !== rowId)
    );
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'checkbox',
        header: (
          <input
            type="checkbox"
            aria-label="Select all"
            onChange={(e) => handleSelectAll(e.target.checked, inquiries)}
            checked={selectedIds.length === inquiries.length && inquiries.length > 0}
            className="accent-blue-600 w-4 h-4"
          />
        ),
        cell: (row: Inquiry) => (
          <input
            type="checkbox"
            aria-label="Select row"
            checked={selectedIds.includes(row.id)}
            onChange={(e) => handleSelectRow(e.target.checked, row.id)}
            className="accent-blue-600 w-4 h-4"
            onClick={e => e.stopPropagation()}
          />
        ),
      },
      {
        accessorKey: 'inquiry_number',
        header: 'Inquiry #',
      },
      {
        accessorKey: 'project_name',
        header: 'Project',
      },
      {
        accessorKey: 'user',
        header: 'User',
        cell: (row: Inquiry) => row.profiles?.full_name || row.profiles?.email || ''
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (row: Inquiry) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[row.status] || 'bg-gray-100 text-gray-800'}`}>
            {row.status}
          </span>
        )
      },
      {
        accessorKey: 'total_amount',
        header: 'Amount',
        cell: (row: Inquiry) => `TSh${row.total_amount?.toLocaleString() || 0}`
      },
      {
        accessorKey: 'created_at',
        header: 'Date',
        cell: (row: Inquiry) => new Date(row.created_at).toLocaleDateString()
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        cell: (row: Inquiry) => (
          <select
            value={row.status}
            onChange={(e) => updateInquiryStatus(row.id, e.target.value)}
            className="text-xs border rounded px-2 py-1"
          >
            <option value="Pending">Pending</option>
            <option value="Quoted">Quoted</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        )
      }
    ],
    [inquiries, selectedIds]
  );

  async function updateInquiryStatus(inquiryId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', inquiryId);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Inquiry status updated successfully",
      });
      onRefresh();
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      toast({
        title: "Error",
        description: "Failed to update inquiry status. Please try again.",
        variant: "destructive"
      });
    }
  }

  const handleExportCSV = () => {
    // Get only selected rows or all visible rows if none are selected
    const filterRows = selectedIds.length
      ? inquiries.filter(row => selectedIds.includes(row.id))
      : inquiries;

    // Export the main columns (skip checkbox/actions)
    const coreColumns = columns.filter(
      (col) =>
        !["checkbox", "actions"].includes(
          typeof col.accessorKey === "string" ? col.accessorKey : ""
        )
    );
    const csv = toCSV(filterRows, coreColumns);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inquiries.csv";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exported",
      description: `Downloaded ${filterRows.length} inquiries as CSV.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ListCheck className="h-6 w-6 text-purple-600" />
          Inquiry Management
        </h2>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={inquiries}
          searchPlaceholder="Search by project, user, status, etc..."
        />
        {inquiries.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            No inquiries found.
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiriesTab;
