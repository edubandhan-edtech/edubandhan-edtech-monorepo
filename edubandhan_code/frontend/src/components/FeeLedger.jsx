import React, { useState } from 'react';
import { 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  Download, 
  Clock, 
  Receipt, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  AlertCircle,
  FileText,
  Copy,
  Check
} from 'lucide-react';

export default function FeeLedger({ currentUser, onRequireAuth, onSwitchTab }) {
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [showGstModal, setShowGstModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const pendingFeeItems = [
    { id: 1, desc: "Term-2 Academic Tuition & Smart Classroom", amount: 1800, dueDate: "20 Apr 2025", status: "Pending" },
    { id: 2, desc: "STEM Robotics Lab & Digital Library Access", amount: 450, dueDate: "20 Apr 2025", status: "Pending" },
    { id: 3, desc: "Campus Sports & Physical Health Infrastructure", amount: 250, dueDate: "20 Apr 2025", status: "Pending" }
  ];

  const totalPending = pendingFeeItems.reduce((acc, item) => acc + item.amount, 0);

  const paymentHistory = [
    {
      id: "EB-PAY-9812",
      date: "14 Jan 2025",
      time: "10:14 AM",
      desc: "Term-1 Tuition & Transport Fee",
      mode: "UPI (Google Pay)",
      refNo: "UPI/501489218204",
      amount: 14500,
      status: "Success",
      gstInvoiceNo: "GST-2025-0814"
    },
    {
      id: "EB-PAY-9104",
      date: "05 Nov 2024",
      time: "02:30 PM",
      desc: "Annual Examination & Science Lab Fee",
      mode: "UPI (PhonePe)",
      refNo: "UPI/431092841920",
      amount: 3200,
      status: "Success",
      gstInvoiceNo: "GST-2024-9104"
    },
    {
      id: "EB-PAY-8890",
      date: "12 Oct 2024",
      time: "11:45 AM",
      desc: "Cultural Annual Day Kit & Library Pass",
      mode: "Net Banking",
      refNo: "TXN/99104812",
      amount: 1200,
      status: "Success",
      gstInvoiceNo: "GST-2024-8890"
    }
  ];

  const handlePayUPI = () => {
    if (!currentUser && onRequireAuth) {
      onRequireAuth({ id: 'fees', title: 'UPI Fee Settlement' });
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      setShowUpiModal(false);
    }, 1200);
  };

  const handleCopyUPI = () => {
    navigator.clipboard?.writeText("edubandhan.fees@icici");
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const openReceiptModal = (item) => {
    setSelectedReceipt(item);
    setShowGstModal(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 800,
            color: 'var(--text-main)',
            margin: '0 0 4px',
            letterSpacing: '-0.3px'
          }}>
            Fee &amp; Payment Management
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Itemized institutional ledger &bull; Instant 1-Tap UPI checkout &bull; Tax compliant GST receipts
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => alert("Annual fee statement PDF downloaded successfully.")}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-main)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Download size={14} color="var(--text-muted)" />
            <span>Download Statement</span>
          </button>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px'
      }}>
        {/* Pending Amount Card */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(18, 33, 58, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Total Due Balance</span>
            <span style={{
              backgroundColor: isPaid ? 'rgba(24, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.12)',
              color: isPaid ? '#18B981' : '#F59E0B',
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700
            }}>
              {isPaid ? "All Settled" : "Due 20 Apr"}
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', margin: '10px 0 4px' }}>
            {isPaid ? "₹0" : `₹${totalPending.toLocaleString()}`}
          </div>
          <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: 0 }}>
            {isPaid ? "Zero outstanding dues for this term" : "Includes Term-2 tuition & lab components"}
          </p>
        </div>

        {/* Paid This Academic Year */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(18, 33, 58, 0.04)'
        }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Settled This Year</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', margin: '10px 0 4px' }}>
            {isPaid ? "₹21,400" : "₹18,900"}
          </div>
          <p style={{ fontSize: '11.5px', color: '#18B981', margin: 0, fontWeight: 600 }}>
            ✓ Verified with bank &amp; GSTIN
          </p>
        </div>

        {/* Payment Mode Availability */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(18, 33, 58, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Zero Surcharge Gateway</span>
          <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-main)' }}>UPI</span>
            <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-main)' }}>GPay</span>
            <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-main)' }}>PhonePe</span>
          </div>
          <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: 0 }}>
            100% RBI &amp; NPCI escrow compliance
          </p>
        </div>
      </div>

      {/* Itemized Pending Breakdown with 1-Tap UPI Action */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        padding: '22px',
        boxShadow: '0 1px 3px rgba(18, 33, 58, 0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Current Pending Fees Breakdown
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Student: Aarav Sharma (Class 5 - Section B)
            </p>
          </div>

          {!isPaid ? (
            <button
              onClick={() => {
                if (!currentUser && onRequireAuth) {
                  onRequireAuth({ id: 'fees', title: 'UPI Fee Settlement' });
                  return;
                }
                setShowUpiModal(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 20px',
                backgroundColor: '#1677FF', // Blue #1677FF for primary action
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(22, 119, 255, 0.25)'
              }}
            >
              <QrCode size={16} />
              <span>Pay ₹{totalPending.toLocaleString()} with UPI</span>
            </button>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: 'rgba(24, 185, 129, 0.1)',
              color: '#18B981',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 700
            }}>
              <CheckCircle2 size={16} />
              <span>Fees Settled Successfully</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {pendingFeeItems.map(item => (
            <div 
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                fontSize: '13px'
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)' }}>{item.desc}</p>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Due Date: {item.dueDate}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>₹{item.amount.toLocaleString()}</span>
                <span style={{
                  display: 'block',
                  fontSize: '10.5px',
                  color: isPaid ? '#18B981' : '#F59E0B',
                  fontWeight: 700
                }}>
                  {isPaid ? "Paid" : item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History Ledger */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 3px rgba(18, 33, 58, 0.04)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            Payment History &amp; GST Tax Receipts
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
            Verified transactions with download-ready GST compliant tax invoices
          </p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontWeight: 600 }}>
              <th style={{ padding: '14px 22px' }}>Receipt # &amp; Date</th>
              <th style={{ padding: '14px 16px' }}>Particulars</th>
              <th style={{ padding: '14px 16px' }}>Payment Mode</th>
              <th style={{ padding: '14px 16px' }}>Status</th>
              <th style={{ padding: '14px 16px' }}>Amount</th>
              <th style={{ padding: '14px 22px', textAlign: 'right' }}>GST Invoice</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map(hist => (
              <tr 
                key={hist.id}
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
              >
                <td style={{ padding: '14px 22px' }}>
                  <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>{hist.id}</p>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{hist.date} &bull; {hist.time}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{hist.desc}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Ref: {hist.refNo}</span>
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--text-main)', fontWeight: 500 }}>
                  {hist.mode}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    backgroundColor: 'rgba(24, 185, 129, 0.1)',
                    color: '#18B981', // Mint Green for success
                    padding: '3px 8px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <CheckCircle2 size={11} />
                    <span>{hist.status}</span>
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 800, color: 'var(--text-main)' }}>
                  ₹{hist.amount.toLocaleString()}
                </td>
                <td style={{ padding: '14px 22px', textAlign: 'right' }}>
                  <button
                    onClick={() => openReceiptModal(hist)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface)',
                      color: '#1677FF',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Receipt size={13} />
                    <span>Receipt</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* UPI Payment Modal */}
      {showUpiModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            width: '420px',
            maxWidth: '90%',
            padding: '26px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  1-Tap UPI Payment
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Instant fee remittance with zero surcharge
                </p>
              </div>
              <button 
                onClick={() => setShowUpiModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              border: '1px solid var(--border-subtle)',
              marginBottom: '16px'
            }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 6px' }}>Amount to Pay</p>
              <h2 style={{ fontSize: '30px', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                ₹{totalPending.toLocaleString()}
              </h2>
              
              <div style={{
                width: '150px',
                height: '150px',
                margin: '16px auto',
                backgroundColor: '#FFFFFF', // Keep QR code white background so scanners can read high contrast
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <QrCode size={96} color="#102A56" />
                <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Scan with GPay/PhonePe</span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '12px',
                color: 'var(--text-muted)'
              }}>
                <span>UPI ID: <strong>edubandhan.fees@icici</strong></span>
                <button
                  onClick={handleCopyUPI}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1677FF' }}
                >
                  {copiedUpi ? <Check size={13} color="#18B981" /> : <Copy size={13} />}
                </button>
              </div>
            </div>

            <button
              onClick={handlePayUPI}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#1677FF',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isProcessing ? "Verifying Bank Escrow..." : `Confirm Payment of ₹${totalPending.toLocaleString()}`}
            </button>
          </div>
        </div>
      )}

      {/* GST Receipt Modal */}
      {showGstModal && selectedReceipt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            width: '480px',
            maxWidth: '90%',
            padding: '26px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#1677FF', textTransform: 'uppercase' }}>
                  Official Tax Invoice
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: '2px 0 0' }}>
                  {selectedReceipt.gstInvoiceNo}
                </h3>
              </div>
              <button 
                onClick={() => setShowGstModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '8px',
              padding: '12px',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginBottom: '16px'
            }}>
              <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>Green Valley High School, Bhubaneswar</p>
              <p style={{ margin: '2px 0 0' }}>GSTIN: 21AAACG0918F1Z8 &bull; Affiliation #330198</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Student:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Aarav Sharma (Class 5-B)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Description:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{selectedReceipt.desc}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{selectedReceipt.mode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transaction Ref:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{selectedReceipt.refNo}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', fontSize: '15px' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Total Paid:</span>
                <span style={{ fontWeight: 800, color: '#18B981' }}>₹{selectedReceipt.amount.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { alert("PDF Tax Receipt downloaded."); setShowGstModal(false); }}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#1677FF',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Download size={14} />
                <span>Download PDF Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
