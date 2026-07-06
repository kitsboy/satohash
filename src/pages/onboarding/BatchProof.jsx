import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'
import {
  Files,
  UploadCloud,
  Trash2,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
  Database,
  Search
} from 'lucide-react'
import Button from '../../components/Button'
import Card from '../../components/Card'
import { calculateHash } from '../../utils/crypto'
import MerkleExplorer from '../../components/MerkleExplorer'
import { Binary } from 'lucide-react'

export default function BatchProof() {
  const { t } = useTranslation()
  const [files, setFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const onDrop = useCallback(async (acceptedFiles) => {
    const newFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        const hash = await calculateHash(file)
        return {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: (file.size / 1024).toFixed(2) + ' KB',
          type: file.type,
          hash: hash,
          status: 'pending'
        }
      })
    )
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const removeFile = (id) => {
    setFiles(files.filter((f) => f.id !== id))
  }

  const [merkleTree, setMerkleTree] = useState(null)

  const handleBatchAnchor = async () => {
    setIsProcessing(true)
    // Simulate batch anchoring process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mockRoot = Math.random().toString(16).substring(2, 66)
    setMerkleTree({
      root: mockRoot,
      atoms: files.map((f) => `${f.name} (SHA-256: ${f.hash.substring(0, 8)})`)
    })

    setFiles(files.map((f) => ({ ...f, status: 'anchored' })))
    setIsProcessing(false)
    setShowResults(true)
  }

  return (
    <div className="page pb-24" style={{ background: 'var(--bg-base)', paddingTop: '100px' }}>
      <div className="layout-container">
        <div className="page-header text-center" style={{ marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '12px',
              background: 'var(--accent-gold-subtle)',
              borderRadius: '16px',
              color: 'var(--accent-gold)',
              marginBottom: '16px'
            }}
          >
            <Files size={32} strokeWidth={2.5} />
          </div>
          <h1
            style={{
              fontWeight: '950',
              fontSize: 'clamp(28px, 6vw, 48px)',
              letterSpacing: '-0.04em',
              marginBottom: '12px',
              color: 'var(--color-text-primary)'
            }}
          >
            Bulk Proof Manager
          </h1>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto',
              fontWeight: '600'
            }}
          >
            Anchor entire document libraries to Bitcoin in a single cryptographic operation.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: files.length > 0 ? '1fr 350px' : '1fr',
            gap: '32px'
          }}
        >
          {/* Main Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Dropzone */}
            {!showResults && (
              <div
                {...getRootProps()}
                style={{
                  padding: '60px 40px',
                  border: '3px dashed #e2e8f0',
                  borderRadius: '32px',
                  background: isDragActive ? '#f0f4ff' : 'white',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderColor: isDragActive ? 'var(--accent-gold)' : '#e2e8f0'
                }}
              >
                <input {...getInputProps()} />
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    color: 'var(--accent-gold)'
                  }}
                >
                  <UploadCloud size={40} />
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: '850', marginBottom: '12px' }}>
                  {isDragActive ? 'Drop your library here' : 'Drop folders or multiple files'}
                </h3>
                <p style={{ color: '#64748b', fontSize: '16px', fontWeight: '500' }}>
                  Select multiple PDF, JPG, or DOCX files to secure simultaneously.
                </p>
              </div>
            )}

            {/* File List */}
            {files.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '850' }}>
                    Document Queue ({files.length})
                  </h3>
                  {!showResults && (
                    <button
                      onClick={() => setFiles([])}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        fontWeight: '700',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {files.map((file) => (
                  <Card
                    key={file.id}
                    style={{
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      background: 'white'
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background:
                          file.status === 'anchored' ? 'rgba(34, 197, 94, 0.1)' : '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: file.status === 'anchored' ? '#22c55e' : '#64748b'
                      }}
                    >
                      {file.status === 'anchored' ? <ShieldCheck size={24} /> : <Files size={24} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '850', fontSize: '16px', color: '#000000' }}>
                        {file.name}
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#333333',
                          fontFamily: 'var(--font-mono)',
                          marginTop: '4px',
                          fontWeight: '700'
                        }}
                      >
                        Hash: {file.hash.substring(0, 16)}...
                      </div>
                    </div>
                    <div
                      style={{
                        textAlign: 'right',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>
                        {file.size}
                      </span>
                      {!showResults ? (
                        <button
                          onClick={() => removeFile(file.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '8px'
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      ) : (
                        <div
                          style={{
                            color: '#22c55e',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '14px',
                            fontWeight: '700'
                          }}
                        >
                          <Zap size={14} /> Verified
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {showResults && merkleTree && (
              <div style={{ marginTop: '24px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px',
                    color: '#1e293b'
                  }}
                >
                  <Binary size={20} className="text-indigo-600" />
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '850' }}>
                    Protocol Visualization
                  </h3>
                </div>
                <MerkleExplorer tree={merkleTree} />
              </div>
            )}
          </div>

          {/* Sidebar Actions */}
          {files.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <Card
                style={{ padding: '32px', background: '#0f172a', color: 'white', border: 'none' }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '850',
                    marginBottom: '24px'
                  }}
                >
                  Batch Stats
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8', fontWeight: '500' }}>Total Files</span>
                    <span style={{ fontWeight: '700' }}>{files.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8', fontWeight: '500' }}>Network Fee</span>
                    <span style={{ color: '#fbbf24', fontWeight: '800' }}>0.00045 BTC</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      padding: '16px 0',
                      borderTop: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <div
                      style={{
                        color: '#94a3b8',
                        fontSize: '12px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}
                    >
                      Merkle Root
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--accent-teal)',
                        wordBreak: 'break-all'
                      }}
                    >
                      3c9a...bd2e
                    </div>
                  </div>
                </div>

                {!showResults ? (
                  <Button
                    variant="primary"
                    fullWidth
                    size="large"
                    onClick={handleBatchAnchor}
                    disabled={isProcessing}
                    style={{ marginTop: '32px', height: '60px' }}
                  >
                    {isProcessing ? 'Processing Batch...' : 'Anchor All Now'}
                    {!isProcessing && <ChevronRight size={20} />}
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    fullWidth
                    size="large"
                    onClick={() => {
                      setFiles([])
                      setShowResults(false)
                    }}
                    style={{
                      marginTop: '32px',
                      height: '60px',
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: 'white'
                    }}
                  >
                    Start New Batch
                  </Button>
                )}
              </Card>

              <div
                style={{
                  padding: '24px',
                  background: 'rgba(99, 102, 241, 0.05)',
                  borderRadius: '24px',
                  border: '1px solid rgba(99, 102, 241, 0.1)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#4f46e5',
                    marginBottom: '12px'
                  }}
                >
                  <Activity size={20} />
                  <span style={{ fontWeight: '800', fontSize: '14px' }}>Network Efficiency</span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                  Batch anchoring saves up to 98% in network fees by committing thousands of
                  documents in a single Merkle Tree transaction.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
