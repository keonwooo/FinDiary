document.addEventListener("DOMContentLoaded", () => {

	// 상단 메뉴아이콘 show,hide satart
	document.querySelectorAll(".menu-link").forEach(function(link) {
		link.addEventListener("click", function() {
			document.body.classList.toggle("left_hide");
		});
	});
	// 상단 메뉴아이콘 show,hide end

	// Leftmenu start
	document.querySelectorAll('.leftMenu .depth1 > a').forEach(link => {
		if (!link.nextElementSibling.classList.contains('depth2')) {
			link.parentNode.classList.add('single');
		}

		link.addEventListener('click', () => {
			link.parentNode.classList.toggle('active');
		});
	});

	document.querySelectorAll('.leftMenu .depth2 a').forEach(link => {
		link.addEventListener('click', () => {
			document.querySelectorAll('.leftMenu .depth2 a').forEach(item => {
				item.classList.remove('active');
			});
			link.classList.add('active');
		});
	});
	// Leftmenu end


	// Dropdown toggle menu start
	document.querySelectorAll('.dropdown-toggle').forEach(function(toggle) {
		toggle.addEventListener('click', function(e) {
			e.stopPropagation();

			var currentDrop = e.currentTarget.parentElement;
			var activeDrops = document.querySelectorAll('.dropdown-wrap.active');

			activeDrops.forEach(function(drop) {
				if (drop !== currentDrop) {
					drop.classList.remove('active');
				}
			});

			currentDrop.classList.toggle('active');
		});
	});
	// Dropdown toggle menu end


    // 클릭 이외의 영역 클릭시 닫기 start
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown-wrap')) {
            document.querySelectorAll('.dropdown-wrap').forEach(function(wrap) {
                wrap.classList.remove('active');
            });
        }
    });
	// 클릭 이외의 영역 클릭시 닫기 end


	//.on 영역 클릭시 hide 막기 start
	const onElements = document.querySelectorAll('.on');
    onElements.forEach(element => {
        element.addEventListener('click', event => {
            event.stopPropagation();
        });
    });
	//.on 영역 클릭시 hide 막기 end


	// modal start
	const modalOpenBtn = document.querySelectorAll('[data-toggle="modal"]');
	modalOpenBtn.forEach(btn => {
		btn.addEventListener('click', () => {
			const targetId = btn.dataset.target.substring(1);
			const modal = document.getElementById(targetId);
			modal.classList.add('modal-active');
		});
	});

	const modalCloseBtn = document.querySelectorAll('.modal [data-dismiss="modal"]');
	modalCloseBtn.forEach(button => {
		button.addEventListener('click', () => {
			const modal = button.closest('.modal');
			modal.classList.remove('modal-active');
		});
	});

	const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            const modalContent = modal.querySelector('.modal-content');
            if (!modalContent.contains(event.target)) {
                modal.classList.remove('modal-active');
            }
        });
    });
	// modal end


	// tabContents start
	function showTabContent(tab) {
		const parent = tab.parentElement.nextElementSibling;
		const target = document.querySelector(tab.dataset.target);

		Array.from(tab.parentElement.children).forEach(sibling => sibling.classList.remove('active'));
		Array.from(parent.children).forEach(content => content.classList.remove('active'));

		tab.classList.add('active');
		target.classList.add('active');
	}

	const firstTabs = document.querySelectorAll('.tab-title-wrap');
	firstTabs.forEach(tabWrap => {
		const firstTab = tabWrap.querySelector('.tab-title');
		showTabContent(firstTab);
	});

	document.querySelectorAll('.tab-title').forEach(tab => {
		tab.addEventListener('click', function() {
			showTabContent(tab);
		});
	});

	// tabContents end


	// tree_item start
	document.querySelectorAll('.treeList').forEach(treeList => {
		const treeItemsParent = treeList.querySelectorAll('.tree_item:has(+.tree) i');
		treeItemsParent.forEach(item => {
			item.addEventListener('click', function() {
				const isActive = this.classList.contains('active');
				if (isActive) {
					this.classList.remove('active');
				} else {
					this.classList.add('active');
				}
			});
		});

		const treeItems = treeList.querySelectorAll('.tree_item');
		treeItems.forEach(item => {
			item.addEventListener('click', function() {
				treeItems.forEach(otherItem => {
					if (otherItem !== item) {
						otherItem.classList.remove('select');
					}
				});
				this.classList.add('select');
			});
		});
	});
	// tree_item end
});