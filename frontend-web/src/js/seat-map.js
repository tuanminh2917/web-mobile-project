class SeatMap {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;
    this.options = {
      rows: options.rows || 10,
      seatsPerRow: options.seatsPerRow || 12,
      maxSelectable: options.maxSelectable || 8,
      ...options
    };
    this.selectedSeats = new Map();
    this.priceMap = {
      regular: options.regularPrice || 50000,
      vip: options.vipPrice || 65000,
      couple: options.couplePrice || 130000
    };
    this.occupiedSeats = options.occupiedSeats || [];
    this.rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.seatTypes = options.seatTypes || {};
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  getSeatType(rowIdx, seatIdx, rowLabel, seatNum) {
    const cacheKey = `${rowLabel}-${seatNum}`;
    if (this.seatTypes[cacheKey]) return this.seatTypes[cacheKey];

    const maxRows = this.options.rows;
    const lastRow = maxRows - 1;
    const midStart = Math.floor(maxRows * 0.4);
    const midEnd = Math.floor(maxRows * 0.7);

    if (rowIdx === lastRow) return 'couple';
    if (rowIdx >= midStart && rowIdx < midEnd) return 'vip';
    return 'regular';
  }

  isOccupied(rowLabel, seatNum) {
    return this.occupiedSeats.some(s => s.row === rowLabel && s.number === seatNum);
  }

  render() {
    this.container.innerHTML = '';
    const map = document.createElement('div');
    map.className = 'seat-map';

    const screenDiv = document.createElement('div');
    screenDiv.className = 'screen-indicator';
    screenDiv.innerHTML = '<div class="screen"></div><span>Màn hình</span>';
    this.container.appendChild(screenDiv);

    for (let r = 0; r < this.options.rows; r++) {
      const row = document.createElement('div');
      row.className = 'seat-row';

      const label = document.createElement('span');
      label.className = 'row-label';
      label.textContent = this.rowLabels[r];
      row.appendChild(label);

      const seatsInRow = this.options.seatsPerRow;
      for (let s = 0; s < seatsInRow; s++) {
        const seatNum = s + 1;
        const rowLabel = this.rowLabels[r];
        const type = this.getSeatType(r, s, rowLabel, seatNum);
        const occupied = this.isOccupied(rowLabel, seatNum);

        const seat = document.createElement('div');
        seat.className = `seat ${type}`;
        if (occupied) seat.classList.add('occupied');
        seat.dataset.row = rowLabel;
        seat.dataset.number = seatNum;
        seat.dataset.type = type;
        seat.dataset.price = this.priceMap[type] || this.priceMap.regular;
        seat.title = `${rowLabel}${seatNum} - ${this.getTypeLabel(type)}`;

        row.appendChild(seat);
      }
      map.appendChild(row);
    }

    this.container.appendChild(map);

    const legend = document.createElement('div');
    legend.className = 'seat-legend';
    legend.innerHTML = `
      <div class="legend-item"><div class="legend-box regular"></div> Ghế thường</div>
      <div class="legend-item"><div class="legend-box vip"></div> VIP</div>
      <div class="legend-item"><div class="legend-box couple"></div> Ghế đôi</div>
      <div class="legend-item"><div class="legend-box selected"></div> Đang chọn</div>
      <div class="legend-item"><div class="legend-box occupied"></div> Đã bán</div>
    `;
    this.container.appendChild(legend);
    this.renderSummary();
  }

  getTypeLabel(type) {
    return { regular: 'Ghế thường', vip: 'VIP', couple: 'Ghế đôi' }[type] || type;
  }

  bindEvents() {
    this.container.addEventListener('click', (e) => {
      const seat = e.target.closest('.seat');
      if (!seat || seat.classList.contains('occupied')) return;
      const key = `${seat.dataset.row}${seat.dataset.number}`;
      if (seat.classList.contains('selected')) {
        seat.classList.remove('selected');
        this.selectedSeats.delete(key);
      } else {
        if (this.selectedSeats.size >= this.options.maxSelectable) {
          alert(`Bạn chỉ có thể chọn tối đa ${this.options.maxSelectable} ghế.`);
          return;
        }
        seat.classList.add('selected');
        this.selectedSeats.set(key, {
          row: seat.dataset.row,
          number: parseInt(seat.dataset.number),
          type: seat.dataset.type,
          price: parseInt(seat.dataset.price)
        });
      }
      this.renderSummary();
    });
  }

  renderSummary() {
    let summaryEl = this.container.querySelector('.seat-summary');
    if (!summaryEl) {
      summaryEl = document.createElement('div');
      summaryEl.className = 'seat-summary';
      this.container.appendChild(summaryEl);
    }

    if (this.selectedSeats.size === 0) {
      summaryEl.innerHTML = '<p style="color:var(--text-muted);font-size:14px;">Chưa chọn ghế nào</p>';
      return;
    }

    const seats = Array.from(this.selectedSeats.values());
    const total = seats.reduce((sum, s) => sum + s.price, 0);

    summaryEl.innerHTML = `
      <h3>Ghế đã chọn (${seats.length})</h3>
      <div class="selected-list">
        ${seats.map(s => `<span class="selected-seat">${s.row}${s.number} - ${this.getTypeLabel(s.type)} - ${s.price.toLocaleString()}đ</span>`).join('')}
      </div>
      <div class="total">
        <span>Tổng cộng</span>
        <span class="amount">${total.toLocaleString()}đ</span>
      </div>
    `;
  }

  getSelectedSeats() {
    return Array.from(this.selectedSeats.values());
  }

  getTotal() {
    return this.getSelectedSeats().reduce((sum, s) => sum + s.price, 0);
  }
}
