'use client';

import { useState, useEffect } from 'react';
import { MenuCategory, MenuItem } from '@/lib/types';

export default function MenuManagement() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (data.success && data.data) {
        setCategories(data.data.categories || []);
        if (data.data.categories?.length > 0 && !activeCategory) {
          setActiveCategory(data.data.categories[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (item: Partial<MenuItem>) => {
    if (!activeCategory) return;
    setSaving(true);

    try {
      const res = await fetch('/api/menu/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: activeCategory, item }),
      });

      if (res.ok) {
        await fetchMenu();
        setShowAddItem(false);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateItem = async (item: MenuItem) => {
    if (!activeCategory) return;
    setSaving(true);

    try {
      const res = await fetch('/api/menu/items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: activeCategory,
          itemId: item.id,
          updates: item,
        }),
      });

      if (res.ok) {
        await fetchMenu();
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!activeCategory || !confirm('Delete this item?')) return;

    try {
      const res = await fetch(
        `/api/menu/items?categoryId=${activeCategory}&itemId=${itemId}`,
        { method: 'DELETE' }
      );

      if (res.ok) {
        await fetchMenu();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleAddCategory = async (category: Partial<MenuCategory>) => {
    setSaving(true);

    try {
      const res = await fetch('/api/menu/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });

      if (res.ok) {
        await fetchMenu();
        setShowAddCategory(false);
      }
    } catch (error) {
      console.error('Error adding category:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Delete this category and all its items?')) return;

    try {
      const res = await fetch(`/api/menu/categories?id=${categoryId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchMenu();
        if (activeCategory === categoryId) {
          setActiveCategory(categories[0]?.id || null);
        }
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const currentCategory = categories.find((c) => c.id === activeCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 font-headline text-xl animate-pulse">
          Loading menu...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl text-[#1a1a1a]">Menu Management</h1>
        <button
          onClick={() => setShowAddCategory(true)}
          className="bg-[#C41E3A] text-white font-headline tracking-wider px-4 py-2 rounded hover:bg-[#a01830] transition-colors"
        >
          + ADD CATEGORY
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white p-4 rounded-lg shadow-sm">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center gap-1">
            <button
              onClick={() => setActiveCategory(category.id)}
              className={`font-headline tracking-wider px-4 py-2 rounded transition-colors ${
                activeCategory === category.id
                  ? 'bg-[#C41E3A] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name.toUpperCase()}
            </button>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              className="text-gray-400 hover:text-red-500 p-1"
              title="Delete category"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Items List */}
      {currentCategory && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h2 className="font-headline text-2xl tracking-wider">
                {currentCategory.name.toUpperCase()}
              </h2>
              {currentCategory.description && (
                <p className="text-gray-500">{currentCategory.description}</p>
              )}
            </div>
            <button
              onClick={() => setShowAddItem(true)}
              className="bg-green-600 text-white font-headline tracking-wider px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              + ADD ITEM
            </button>
          </div>

          <div className="divide-y">
            {currentCategory.items?.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No items in this category yet. Add your first item!
              </div>
            ) : (
              currentCategory.items?.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 flex items-center justify-between hover:bg-gray-50 ${
                    item.available === false ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline text-lg">{item.name}</h3>
                      {item.popular && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                          Popular
                        </span>
                      )}
                      {item.featured && (
                        <span className="bg-[#C41E3A] text-white text-xs px-2 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                      {item.available === false && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                          Unavailable
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-headline text-xl text-[#C41E3A]">
                      ${item.price.toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && (
        <ItemModal
          onClose={() => setShowAddItem(false)}
          onSave={handleAddItem}
          saving={saving}
        />
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <ItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleUpdateItem}
          saving={saving}
        />
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <CategoryModal
          onClose={() => setShowAddCategory(false)}
          onSave={handleAddCategory}
          saving={saving}
        />
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <CategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={async () => {}}
          saving={saving}
        />
      )}
    </div>
  );
}

// Item Modal Component
function ItemModal({
  item,
  onClose,
  onSave,
  saving,
}: {
  item?: MenuItem;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState<Partial<MenuItem>>(
    item || {
      name: '',
      description: '',
      price: 0,
      popular: false,
      featured: false,
      available: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: formData.id || formData.name?.toLowerCase().replace(/\s+/g, '-') || '',
      name: formData.name || '',
      description: formData.description,
      price: Number(formData.price) || 0,
      popular: formData.popular,
      featured: formData.featured,
      available: formData.available,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="font-headline text-2xl mb-4">
          {item ? 'EDIT ITEM' : 'ADD NEW ITEM'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-headline text-sm text-gray-600 mb-1">
              NAME *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:border-[#C41E3A] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-headline text-sm text-gray-600 mb-1">
              DESCRIPTION
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:border-[#C41E3A] focus:outline-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block font-headline text-sm text-gray-600 mb-1">
              PRICE *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border rounded focus:border-[#C41E3A] focus:outline-none"
              required
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.popular || false}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="w-4 h-4 accent-[#C41E3A]"
              />
              <span className="text-sm">Popular</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 accent-[#C41E3A]"
              />
              <span className="text-sm">Featured</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.available !== false}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-4 h-4 accent-[#C41E3A]"
              />
              <span className="text-sm">Available</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-[#C41E3A] text-white rounded hover:bg-[#a01830] transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : item ? 'Update' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Category Modal Component
function CategoryModal({
  category,
  onClose,
  onSave,
  saving,
}: {
  category?: MenuCategory;
  onClose: () => void;
  onSave: (category: Partial<MenuCategory>) => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState<Partial<MenuCategory>>(
    category || {
      name: '',
      description: '',
      icon: 'utensils',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="font-headline text-2xl mb-4">
          {category ? 'EDIT CATEGORY' : 'ADD NEW CATEGORY'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-headline text-sm text-gray-600 mb-1">
              NAME *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:border-[#C41E3A] focus:outline-none"
              required
              placeholder="e.g., Appetizers"
            />
          </div>

          <div>
            <label className="block font-headline text-sm text-gray-600 mb-1">
              DESCRIPTION
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:border-[#C41E3A] focus:outline-none"
              rows={2}
              placeholder="e.g., Start your meal off right"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-[#C41E3A] text-white rounded hover:bg-[#a01830] transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : category ? 'Update' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
