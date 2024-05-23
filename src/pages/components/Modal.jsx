function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <div className="bg-white p-4 rounded shadow-lg">
          <button onClick={onClose} className="float-right">X</button>
          {children}
        </div>
      </div>
    );
  }
  