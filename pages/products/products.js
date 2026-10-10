window.productPage = {
    init: function() {
        // Mock data ban đầu
        this.data = [
            { id: 1, name: 'Bắp rang bơ (Vừa)', category: 'Đồ ăn', price: 45000, stock: 100, status: 'active', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvYAr3P0zz2NjVc6vGNKkO4EVw-TdlrHJdLWeikFyXnOnju3Q8aiZrVKU&s=10', desc: 'Bắp rang bơ phô mai' },
            { id: 2, name: 'Coca Cola', category: 'Nước uống', price: 30000, stock: 250, status: 'active', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwAa7Fx-0Z1kRQ4Xtin2KegNgCW2KRHws759irIlETyA&s=10', desc: 'Coca tươi' },
            { id: 3, name: 'Combo Solo', category: 'Combo', price: 70000, stock: 50, status: 'inactive', image: 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/07/gia-bap-nuoc-cgv-3.jpg', desc: '1 Bắp + 1 Nước' }
        ];
        
        window.productPage = this;
        
        // Đóng dropdown khi click ra ngoài
        document.addEventListener('click', function(e) {
            const dropdown = document.querySelector('.custom-dropdown');
            if (dropdown && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
        
        // Fetch HTML
        fetch('pages/products/products.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('content').innerHTML = html;
                this.renderTable(this.data);
            });

        // Hàm dọn dẹp khi chuyển trang 
        return () => {
            delete window.productPage;
        };
    },

    renderTable: function(dataToRender) {
        const tbody = document.getElementById('product-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        if (dataToRender.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center">Không tìm thấy sản phẩm nào.</td></tr>';
            return;
        }

        dataToRender.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${p.image}" class="product-img" alt="${p.name}"></td>
                <td><strong>${p.name}</strong></td>
                <td>${p.category}</td>
                <td>${p.price.toLocaleString('vi-VN')} đ</td>
                <td>${p.stock}</td>
                <td>
                    <span class="status-badge ${p.status === 'active' ? 'status-active' : 'status-inactive'}">
                        ${p.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                    </span>
                </td>
                <td>
                    <div class="action-group">
                        <button class="btn-icon" title="Sửa" onclick="productPage.editProduct(${p.id})"><i class="bi bi-pencil"></i></button>
                        <button class="btn-icon delete" title="Xóa" onclick="productPage.deleteProduct(${p.id})"><i class="bi bi-trash"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    search: function() {
        const keyword = document.getElementById('search-product').value.toLowerCase();
        const statusFilter = document.getElementById('filter-status').value;

        const filtered = this.data.filter(p => {
            const matchName = p.name.toLowerCase().includes(keyword);
            const matchStatus = statusFilter === 'all' ? true : p.status === statusFilter;
            return matchName && matchStatus;
        });

        this.renderTable(filtered);
    },

    // --- CÁC HÀM XỬ LÝ DROPDOWN ---
    toggleDropdown: function() {
        const dropdown = document.querySelector('.custom-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    },

    selectOption: function(value, text) {
        document.getElementById('dropdown-text').textContent = text;
        document.getElementById('filter-status').value = value;
        document.querySelector('.custom-dropdown').classList.remove('active');
        this.search();
    },
    // ----------------------------------------

    openModal: function(id = null) {
        const modal = document.getElementById('product-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('product-form');
        form.reset();

        if (id) {
            title.textContent = 'Cập nhật Sản phẩm';
            const p = this.data.find(item => item.id === id);
            if (p) {
                document.getElementById('product-id').value = p.id;
                document.getElementById('product-name').value = p.name;
                document.getElementById('product-category').value = p.category;
                
                // đảm bảo việc nếu ko có product-desc sẽ ko lỗi
                const descEl = document.getElementById('product-desc');
                if(descEl) descEl.value = p.desc || ''; 
                
                document.getElementById('product-price').value = p.price;
                document.getElementById('product-stock').value = p.stock;
                document.getElementById('product-image').value = p.image !== 'https://via.placeholder.com/50' ? p.image : '';
                document.getElementById('product-status').value = p.status;
            }
        } else {
            title.textContent = 'Thêm Sản phẩm mới';
            document.getElementById('product-id').value = '';
        }

        modal.classList.add('show');
    },

    closeModal: function() {
        document.getElementById('product-modal').classList.remove('show');
    },

    saveProduct: function(event) {
        event.preventDefault();
        
        const id = document.getElementById('product-id').value;
        const descEl = document.getElementById('product-desc');
        
        const newProduct = {
            id: id ? parseInt(id) : Date.now(),
            name: document.getElementById('product-name').value,
            category: document.getElementById('product-category').value,
            desc: descEl ? descEl.value : '',
            price: parseInt(document.getElementById('product-price').value),
            stock: parseInt(document.getElementById('product-stock').value),
            image: document.getElementById('product-image').value || 'https://via.placeholder.com/50',
            status: document.getElementById('product-status').value
        };

        if (id) {
            const index = this.data.findIndex(item => item.id === parseInt(id));
            if (index !== -1) this.data[index] = newProduct;
        } else {
            this.data.push(newProduct);
        }

        this.closeModal();
        this.renderTable(this.data);
    },

    editProduct: function(id) {
        this.openModal(id);
    },

    deleteProduct: function(id) {
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            this.data = this.data.filter(item => item.id !== id);
            this.search(); 
        }
    }
};

window.productPage.init();
