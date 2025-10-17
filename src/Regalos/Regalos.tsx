import React, { useEffect, useMemo, useState } from 'react'
import './Regalos.css'
import type { Regalo } from './RegalosPanel'
import { loadRegalos, saveRegalos, addRegalo as storeAdd, REGALOS_BASE } from './regalosStore'

export type RolUsuario = 'viewer' | 'streamer'

type Props = { usuario?: string; rol?: RolUsuario }

const puedeEditarGlobal = (usuario?: string, rol?: RolUsuario) => rol === 'streamer' && usuario === 'Streamer1'

const RegalosPage: React.FC<Props> = ({ usuario, rol }) => {
  const [regalos, setRegalos] = useState<Regalo[]>(REGALOS_BASE)
  const [edit, setEdit] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<{ emoji: string; name: string; cost: string }>({ emoji: '🎁', name: '', cost: '0' })

  const canEdit = useMemo(() => puedeEditarGlobal(usuario, rol), [usuario, rol])

  useEffect(() => { setRegalos(loadRegalos()) }, [])

  const setNombre = (id: string, name: string) => {
    setRegalos((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, name } : r))
      saveRegalos(next)
      return next
    })
  }
  const setCosto = (id: string, cost: number) => {
    setRegalos((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, cost } : r))
      saveRegalos(next)
      return next
    })
  }

  const onGuardarNuevo = () => {
    const name = form.name.trim()
    const emoji = form.emoji.trim() || '🎁'
    const cost = Math.max(0, Number(form.cost) || 0)
    if (!name) return alert('Coloca un nombre')
    const nuevo: Regalo = { id: `rg_${Date.now()}`, emoji, name, cost }
    const next = storeAdd(nuevo)
    setRegalos(next)
    setShowModal(false)
    setForm({ emoji: '🎁', name: '', cost: '0' })
  }

  return (
    <div className="regalos-page">
      <div className="regalos-header">
        <div className="regalos-title">Regalos</div>
        {canEdit && (
          <div className="regalos-actions">
            <button className="regalos-btn" onClick={() => setEdit((v) => !v)} title="Editar">✎</button>
            <button className="regalos-btn" onClick={() => setShowModal(true)} title="Nuevo">＋</button>
          </div>
        )}
      </div>

      <div className="regalos-grid">
        {regalos.map((g) => (
          <div key={g.id} className="regalo-card">
            <div className="regalo-row">
              <div className="regalo-emoji" aria-hidden>{g.emoji}</div>
              {edit && canEdit ? (
                <input className="regalo-input" value={g.name} onChange={(e) => setNombre(g.id, e.target.value)} />
              ) : (
                <div className="regalo-name">{g.name}</div>
              )}
            </div>
            <div className="regalo-row">
              {edit && canEdit ? (
                <>
                  <input className="regalo-cost-input" type="number" min={0} value={g.cost} onChange={(e) => setCosto(g.id, Math.max(0, Number(e.target.value)))} />
                  <span className="regalo-cost">monedas</span>
                </>
              ) : (
                <div className="regalo-cost">{g.cost} monedas</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="regalo-modal-overlay" role="dialog" aria-label="Nuevo regalo">
          <div className="regalo-modal">
            <h4>Crear nuevo regalo</h4>
            <div className="regalo-form">
              <div className="regalo-form-row">
                <input placeholder="Emoji (ej: 🎉)" value={form.emoji} onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))} />
                <input placeholder="Nombre" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="regalo-form-row">
                <input type="number" min={0} placeholder="Costo" value={form.cost} onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))} />
              </div>
              <div className="regalo-modal-actions">
                <button className="regalos-btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="regalos-btn btn-primary" onClick={onGuardarNuevo}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegalosPage
