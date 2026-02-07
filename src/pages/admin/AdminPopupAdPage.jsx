


import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ChevronDown } from "lucide-react";
import DynamicTable from "../../components/admin/DynamicTable";
import Pagination from "../../components/admin/Pagination";
import ConfirmationPopup from "../../components/admin/ConfirmationPopup";
import FullScreenAdFormPopup from "../../components/admin/FullScreenAdFormPopup";
import { useApi } from "../../context/ApiContext";
import {
  fetchPopupAds,
  createPopupAd,
  updatePopupAd,
  deletePopupAd,
} from "../../services/popupAdService";
import PopupAdFormPopup from "../../components/admin/PopupAdFormPopup";

function Adminpopupad() {
  const { baseURL } = useApi();
  const [ads, setAds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterPageType, setFilterPageType] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const ITEMS_PER_PAGE = 10;

  // Load ads dynamically
  useEffect(() => {
    loadAds();
  }, [baseURL]);

  const loadAds = async () => {
    try {
      setIsProcessing(true);
      const data = await fetchPopupAds(baseURL); // fetch from backend
      const mappedAds = data.map((ad) => ({
        id: ad.id,
        title: ad.title || "",
        pageType: ad.page_type || "Unknown",
        status: ad.status ? "Active" : "Inactive",
        image: ad.image ? `${baseURL}/${ad.image}` : "https://via.placeholder.com/150",
      }));
      setAds(mappedAds);
    } catch (err) {
      console.error("Failed to load full screen ads:", err);
      setAds([]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Add / Edit
  const handleAddNew = () => {
    setEditingAd(null);
    setIsPopupOpen(true);
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setIsPopupOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsProcessing(true);
      if (editingAd) {
        await updatePopupAd(baseURL, editingAd.id, formData);
      } else {
        await createPopupAd(baseURL, formData);
      }
      await loadAds();
      setIsPopupOpen(false);
      setEditingAd(null);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete
  const handleDelete = (ad) => {
    setAdToDelete(ad);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    if (!adToDelete) return;
    try {
      setIsProcessing(true);
      await deletePopupAd(baseURL, adToDelete.id);
      await loadAds();
      setIsDeletePopupOpen(false);
      setAdToDelete(null);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter
  const pageTypes = ["All", ...new Set(ads.map((ad) => ad.pageType))];
  const filteredAds = ads.filter(
    (ad) => filterPageType === "All" || ad.pageType === filterPageType
  );

  const handleFilterChange = (type) => {
    setFilterPageType(type);
    setCurrentPage(1);
    setIsDropdownOpen(false);
  };

  // Table columns
  const columns = [
    {
      header: "Sl. No.",
      cell: (_, index) => <span>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</span>,
    },
    {
      header: "Title",
      accessor: "title",
      cellClassName: "font-medium text-gray-900",
    },
    {
      header: "Image",
      accessor: "image",
      type: "image",
      cell: (row) => <img src={row.image} alt={row.title} className="h-12 w-20 object-cover rounded" />,
    },
    {
      header: "Page Type",
      accessor: "pageType",
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            row.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  // Pagination
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentAds = filteredAds.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAds.length / ITEMS_PER_PAGE);

  return (
    <div>
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Pop Up Advertisement</h1>
          <p className="text-gray-700 mt-1 text-sm md:text-base">Manage Pop Up advertisements.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Page Type Filter */}
          <div className="w-full sm:w-auto relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full sm:w-60 bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-left flex justify-between items-center"
            >
              <span>{filterPageType}</span>
              <ChevronDown size={20} className="text-gray-400" />
            </button>
            {isDropdownOpen && (
              <ul className="absolute z-50 mt-1 sm:w-60 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {pageTypes.map((type) => (
                  <li
                    key={type}
                    onClick={() => handleFilterChange(type)}
                    className="cursor-pointer px-4 py-2 hover:bg-brand-red hover:text-white transition-colors"
                  >
                    {type}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg hover:bg-brand-dark"
            disabled={isProcessing}
          >
            <Plus size={20} />
            {isProcessing ? "Processing..." : "Add Pop Up Ad"}
          </button>
        </div>
      </div>

      {/* Table */}
      <DynamicTable columns={columns} data={currentAds} search={false} />

      {/* Pagination */}
      {filteredAds.length > 0 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      {/* Add/Edit Popup */}
      <PopupAdFormPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleFormSubmit}
        ad={editingAd}
        isProcessing={isProcessing}
      />

      {/* Delete Confirmation */}
      <ConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Advertisement"
        message="Are you sure you want to delete this ad?"
        isConfirming={isProcessing}
      />
    </div>
  );
}

export default Adminpopupad;
