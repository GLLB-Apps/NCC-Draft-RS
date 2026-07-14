import type { ContentBlock } from '../../lib/types'

const BLOCK_TYPES: { type: ContentBlock['type']; label: string }[] = [
  { type: 'heading', label: 'Rubrik' },
  { type: 'paragraph', label: 'Brödtext' },
  { type: 'quote', label: 'Citat' },
  { type: 'factbox', label: 'Faktaruta' },
  { type: 'warning', label: 'Varningsruta' },
  { type: 'image', label: 'Bild' },
  { type: 'video', label: 'Video' },
  { type: 'divider', label: 'Avdelare' },
  { type: 'button', label: 'Knapp' },
  { type: 'sources', label: 'Källförteckning' },
]

interface BlockEditorProps {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  function addBlock(type: ContentBlock['type']) {
    const newBlock: ContentBlock = { type }
    if (type === 'paragraph' || type === 'heading' || type === 'quote') newBlock.text = ''
    if (type === 'factbox' || type === 'warning') { newBlock.title = ''; newBlock.text = '' }
    if (type === 'image') { newBlock.image_url = ''; newBlock.alt_text = ''; newBlock.text = '' }
    if (type === 'video') { newBlock.video_url = ''; newBlock.title = '' }
    if (type === 'button') { newBlock.text = ''; newBlock.url = '' }
    if (type === 'sources') { newBlock.sources = [] }
    onChange([...blocks, newBlock])
  }

  function updateBlock(index: number, updates: Partial<ContentBlock>) {
    const updated = blocks.map((b, i) => i === index ? { ...b, ...updates } : b)
    onChange(updated)
  }

  function removeBlock(index: number) {
    onChange(blocks.filter((_, i) => i !== index))
  }

  function moveBlock(index: number, dir: 'up' | 'down') {
    const target = dir === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= blocks.length) return
    const updated = [...blocks]
    ;[updated[index], updated[target]] = [updated[target], updated[index]]
    onChange(updated)
  }

  return (
    <div className="block-editor">
      {blocks.map((block, i) => (
        <div key={i} className="block-editor-item">
          <div className="block-editor-header">
            <span className="block-editor-type">
              {BLOCK_TYPES.find(t => t.type === block.type)?.label ?? block.type}
            </span>
            <div className="block-editor-controls">
              <button type="button" className="block-editor-control" onClick={() => moveBlock(i, 'up')} disabled={i === 0} aria-label="Flytta upp">↑</button>
              <button type="button" className="block-editor-control" onClick={() => moveBlock(i, 'down')} disabled={i === blocks.length - 1} aria-label="Flytta ner">↓</button>
              <button type="button" className="block-editor-control danger" onClick={() => removeBlock(i)} aria-label="Ta bort">✕</button>
            </div>
          </div>

          {(block.type === 'heading' || block.type === 'paragraph' || block.type === 'quote') && (
            <textarea
              className="form-textarea"
              value={block.text ?? ''}
              onChange={e => updateBlock(i, { text: e.target.value })}
              rows={block.type === 'paragraph' ? 4 : 2}
              placeholder={block.type === 'heading' ? 'Rubriktext' : block.type === 'quote' ? 'Citattext' : 'Brödtext'}
            />
          )}

          {(block.type === 'factbox' || block.type === 'warning') && (
            <>
              <div className="form-group">
                <input
                  className="form-input"
                  type="text"
                  value={block.title ?? ''}
                  onChange={e => updateBlock(i, { title: e.target.value })}
                  placeholder="Titel"
                />
              </div>
              <textarea
                className="form-textarea"
                value={block.text ?? ''}
                onChange={e => updateBlock(i, { text: e.target.value })}
                rows={3}
                placeholder="Text"
              />
            </>
          )}

          {block.type === 'image' && (
            <>
              <div className="form-group">
                <input className="form-input" type="url" value={block.image_url ?? ''} onChange={e => updateBlock(i, { image_url: e.target.value })} placeholder="Bildadress (URL)" />
              </div>
              <div className="form-group">
                <input className="form-input" type="text" value={block.alt_text ?? ''} onChange={e => updateBlock(i, { alt_text: e.target.value })} placeholder="Alt-text" />
              </div>
              <input className="form-input" type="text" value={block.text ?? ''} onChange={e => updateBlock(i, { text: e.target.value })} placeholder="Bildtext" />
            </>
          )}

          {block.type === 'video' && (
            <>
              <div className="form-group">
                <input className="form-input" type="url" value={block.video_url ?? ''} onChange={e => updateBlock(i, { video_url: e.target.value })} placeholder="Video-URL (YouTube/Vimeo embed)" />
              </div>
              <input className="form-input" type="text" value={block.title ?? ''} onChange={e => updateBlock(i, { title: e.target.value })} placeholder="Titel (valfritt)" />
            </>
          )}

          {block.type === 'button' && (
            <>
              <div className="form-group">
                <input className="form-input" type="text" value={block.text ?? ''} onChange={e => updateBlock(i, { text: e.target.value })} placeholder="Knapptext" />
              </div>
              <input className="form-input" type="url" value={block.url ?? ''} onChange={e => updateBlock(i, { url: e.target.value })} placeholder="Länk (URL)" />
            </>
          )}

          {block.type === 'sources' && (
            <div>
              {(block.sources ?? []).map((src, si) => (
                <div key={si} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  <input className="form-input" type="text" value={src.label} onChange={e => {
                    const sources = [...(block.sources ?? [])]
                    sources[si] = { ...sources[si], label: e.target.value }
                    updateBlock(i, { sources })
                  }} placeholder="Källnamn" />
                  <input className="form-input" type="url" value={src.url} onChange={e => {
                    const sources = [...(block.sources ?? [])]
                    sources[si] = { ...sources[si], url: e.target.value }
                    updateBlock(i, { sources })
                  }} placeholder="URL" />
                  <button type="button" className="block-editor-control danger" onClick={() => {
                    const sources = (block.sources ?? []).filter((_, j) => j !== si)
                    updateBlock(i, { sources })
                  }}>✕</button>
                </div>
              ))}
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => {
                const sources = [...(block.sources ?? []), { label: '', url: '' }]
                updateBlock(i, { sources })
              }}>+ Lägg till källa</button>
            </div>
          )}
        </div>
      ))}

      <div className="block-add-bar">
        {BLOCK_TYPES.map(t => (
          <button key={t.type} type="button" className="block-add-btn" onClick={() => addBlock(t.type)}>
            + {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
