import { useState, useEffect } from "react";
import PlantList from "./components/PlantList";
import PlantForm from "./components/PlantForm";
import PlantDetail from "./components/PlantDetail";
import CareReminder from "./components/CareReminder";
import CustomFieldManager from "./components/CustomFieldManager";
import AlphaBanner from "./components/AlphaBanner";
import InstallPrompt from "./components/InstallPrompt";
import NotificationSettings from "./components/NotificationSettings";
import {
  getAllPlants,
  createPlant,
  updatePlant,
  deletePlant,
  waterPlant,
  getPlantsNeedingWater,
} from "./db/plants";
import { initDB } from "./db/db";
import { updateBadgeCount, clearBadge } from "./utils/notifications";
import "./App.css";

const App = () => {
  const [plants, setPlants] = useState([]);
  const [plantsNeedingWater, setPlantsNeedingWater] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showNeedsWaterOnly, setShowNeedsWaterOnly] = useState(false);
  const [showFieldManager, setShowFieldManager] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize database and load plants
  useEffect(() => {
    const loadData = async () => {
      try {
        await initDB();
        await refreshPlants();
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Refresh plants from database
  const refreshPlants = async () => {
    const allPlants = await getAllPlants();
    const needsWater = await getPlantsNeedingWater();
    setPlants(allPlants);
    setPlantsNeedingWater(needsWater);

    // Update badge count
    await updateBadgeCount(needsWater.length);
  };

  // Handle adding a new plant
  const handleAddPlant = async (formData) => {
    try {
      await createPlant({
        name: formData.name,
        species: formData.species,
        photo: formData.photo,
        wateringFrequency: parseInt(formData.wateringFrequency, 10),
        notes: formData.notes,
        customFields: formData.customFields,
      });

      await refreshPlants();
      setShowForm(false);
    } catch (error) {
      console.error("Error adding plant:", error);
      alert("Failed to add plant. Please try again.");
    }
  };

  // Handle editing a plant
  const handleEditPlant = async (formData) => {
    try {
      await updatePlant(editingPlant.id, {
        name: formData.name,
        species: formData.species,
        photo: formData.photo,
        wateringFrequency: parseInt(formData.wateringFrequency, 10),
        notes: formData.notes,
        customFields: formData.customFields,
      });

      await refreshPlants();
      setEditingPlant(null);
    } catch (error) {
      console.error("Error updating plant:", error);
      alert("Failed to update plant. Please try again.");
    }
  };

  // Handle deleting a plant
  const handleDeletePlant = async (plantId) => {
    try {
      await deletePlant(plantId);
      await refreshPlants();
    } catch (error) {
      console.error("Error deleting plant:", error);
      alert("Failed to delete plant. Please try again.");
    }
  };

  // Handle watering a plant
  const handleWaterPlant = async (plantId) => {
    try {
      await waterPlant(plantId);
      await refreshPlants();
    } catch (error) {
      console.error("Error watering plant:", error);
      alert("Failed to water plant. Please try again.");
    }
  };

  // Toggle filter to show only plants needing water
  const handleReminderClick = () => {
    setShowNeedsWaterOnly(!showNeedsWaterOnly);
  };

  // Determine which plants to display
  const displayedPlants = showNeedsWaterOnly ? plantsNeedingWater : plants;

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌱 Gaia Plant Care</h1>
        <div className="header-actions">
          <button
            className="manage-fields-btn"
            onClick={() => setShowNotificationSettings(true)}
            title="Notification Settings"
          >
            🔔
          </button>
          <button
            className="manage-fields-btn"
            onClick={() => setShowFieldManager(true)}
            title="Manage Custom Fields"
          >
            ⚙️
          </button>
          <button className="add-plant-btn" onClick={() => setShowForm(true)}>
            + Add Plant
          </button>
        </div>
      </header>

      <AlphaBanner />

      <CareReminder
        count={plantsNeedingWater.length}
        onClick={handleReminderClick}
      />

      {showNeedsWaterOnly && (
        <div className="filter-banner">
          <span>Showing plants needing water</span>
          <button onClick={() => setShowNeedsWaterOnly(false)}>Show All</button>
        </div>
      )}

      <main className="app-main">
        <PlantList
          plants={displayedPlants}
          onWaterPlant={handleWaterPlant}
          onPlantClick={setSelectedPlant}
        />
      </main>

      {showForm && (
        <PlantForm
          onSubmit={handleAddPlant}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingPlant && (
        <PlantForm
          onSubmit={handleEditPlant}
          onCancel={() => setEditingPlant(null)}
          initialData={editingPlant}
        />
      )}

      {selectedPlant && (
        <PlantDetail
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
          onEdit={setEditingPlant}
          onDelete={handleDeletePlant}
          onWater={handleWaterPlant}
        />
      )}

      {showFieldManager && (
        <CustomFieldManager
          onClose={() => setShowFieldManager(false)}
          onFieldsChanged={refreshPlants}
        />
      )}

      {showNotificationSettings && (
        <NotificationSettings
          onClose={() => setShowNotificationSettings(false)}
        />
      )}

      <InstallPrompt />
    </div>
  );
};

export default App;
