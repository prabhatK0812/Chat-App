import React, { useMemo, useState } from 'react'
import emojiList from '../assets/emojiList'

const EmojiPicker = ({ onSelect, onClose }) => {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim()
    if (!q) return emojiList
    return emojiList.filter(e => e.includes(q) || e.toLowerCase().includes(q.toLowerCase()))
  }, [query])

  return (
    <div className='w-64 max-h-56 bg-white/5 backdrop-blur-md rounded-xl p-2 shadow-lg text-sm text-white z-50'>
      <div className='px-2 pb-2'>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Search emoji' 
          className='w-full px-2 py-1 rounded-md bg-white/10 placeholder-gray-300 outline-none text-sm text-white'/>
      </div>

      <div className='overflow-auto max-h-40 p-2'>
        <div className='grid grid-cols-8 gap-2'>
          {filtered.map((emoji, idx) => (
            <button key={idx} onClick={() => { onSelect(emoji); if(onClose) onClose(); }}
              className='h-8 w-8 flex items-center justify-center rounded-md hover:bg-white/10 transition'>
              <span className='text-lg'>{emoji}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmojiPicker
