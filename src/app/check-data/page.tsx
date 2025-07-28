"use client";

import { Button, Checkbox, InputField, SelectDropdown, Textarea } from "@/components/atoms";
import React, { useEffect, useState } from "react";

// Types
interface Season {
  seasonId: string;
  concerts: Concert[];
}

interface SeasonWithConcerts extends Season {
  concerts: Concert[];
}

interface Performer {
  workId: string;
  instruments: {
    instrument: string;
    musicians: string[];
  }[];
}

interface Concert {
  _id?: string;
  concertId: string;
  title: string;
  subtitle?: string;
  description?: string;
  date: string;
  venueId: string;
  ticketsLinks?: {
    singleLive?: { price: number; url: string };
    singleStreaming?: { price: number; url: string };
  };
  program: ProgramItem[];
  performers: Performer[];
  status?: string;
}

interface ProgramItem {
  workId: string;
  is_premiere: boolean;
  is_commission: boolean;
  notes?: string;
}

interface Composer {
  _id?: string;
  composerId: string;
  name: string;
  nationality?: string;
  born?: number;
  died?: number;
}

interface Work {
  _id?: string;
  workId: string;
  composerId: string;
  title: string;
  subtitle?: string;
  year?: string;
  duration?: string;
  movements?: string[];
  instrumentation?: { instrument: string; count: number }[];
  description?: string;
}

interface Venue {
  _id?: string;
  venueId: string;
  name: string;
  address?: string;
}

interface Musician {
  _id?: string;
  musicianId: string;
  name: string;
}

type TabType = "seasons" | "composers" | "works" | "venues" | "musicians";

// Program Editor Component
const ProgramEditor: React.FC<{
  program: ProgramItem[];
  composers: Composer[];
  works: Work[];
  onChange: (program: ProgramItem[]) => void;
}> = ({ program, composers, works, onChange }) => {
  const [selectedComposers, setSelectedComposers] = useState<{ [key: number]: string }>({});

  // Initialize selected composers based on existing program
  useEffect(() => {
    const initialComposers: { [key: number]: string } = {};
    program.forEach((item, index) => {
      if (item.workId) {
        const work = works.find((w) => w.workId === item.workId);
        if (work) {
          initialComposers[index] = work.composerId;
        }
      }
    });
    setSelectedComposers(initialComposers);
  }, [program, works]);

  const addProgramItem = () => {
    const newItem: ProgramItem = {
      workId: "",
      is_premiere: false,
      is_commission: false,
      notes: "",
    };
    const newProgram = [...program, newItem];
    onChange(newProgram);
  };

  const removeProgramItem = (index: number) => {
    const newProgram = program.filter((_, i) => i !== index);
    onChange(newProgram);
    // Clean up selected composer for this index
    const newSelectedComposers = { ...selectedComposers };
    delete newSelectedComposers[index];
    // Adjust indices for remaining items
    const adjustedComposers: { [key: number]: string } = {};
    Object.entries(newSelectedComposers).forEach(([key, value]) => {
      const numKey = parseInt(key);
      if (numKey > index) {
        adjustedComposers[numKey - 1] = value;
      } else if (numKey < index) {
        adjustedComposers[numKey] = value;
      }
    });
    setSelectedComposers(adjustedComposers);
  };

  const updateProgramItem = (index: number, field: keyof ProgramItem, value: string | boolean) => {
    const newProgram = [...program];
    newProgram[index] = { ...newProgram[index], [field]: value };
    onChange(newProgram);
  };

  const moveProgramItemUp = (index: number) => {
    if (index === 0) return;
    const newProgram = [...program];
    [newProgram[index - 1], newProgram[index]] = [newProgram[index], newProgram[index - 1]];
    onChange(newProgram);

    // Also swap the selected composers
    const newSelectedComposers = { ...selectedComposers };
    const currentComposer = newSelectedComposers[index];
    const previousComposer = newSelectedComposers[index - 1];
    if (currentComposer) {
      newSelectedComposers[index - 1] = currentComposer;
    } else {
      delete newSelectedComposers[index - 1];
    }
    if (previousComposer) {
      newSelectedComposers[index] = previousComposer;
    } else {
      delete newSelectedComposers[index];
    }
    setSelectedComposers(newSelectedComposers);
  };

  const moveProgramItemDown = (index: number) => {
    if (index === program.length - 1) return;
    const newProgram = [...program];
    [newProgram[index], newProgram[index + 1]] = [newProgram[index + 1], newProgram[index]];
    onChange(newProgram);

    // Also swap the selected composers
    const newSelectedComposers = { ...selectedComposers };
    const currentComposer = newSelectedComposers[index];
    const nextComposer = newSelectedComposers[index + 1];
    if (currentComposer) {
      newSelectedComposers[index + 1] = currentComposer;
    } else {
      delete newSelectedComposers[index + 1];
    }
    if (nextComposer) {
      newSelectedComposers[index] = nextComposer;
    } else {
      delete newSelectedComposers[index];
    }
    setSelectedComposers(newSelectedComposers);
  };

  const handleComposerChange = (index: number, composerId: string) => {
    setSelectedComposers((prev) => ({ ...prev, [index]: composerId }));
    // Clear the work selection when composer changes
    updateProgramItem(index, "workId", "");
  };

  const getWorksForComposer = (composerId: string) => {
    return works.filter((work) => work.composerId === composerId);
  };

  return (
    <div className="mb-0">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-medium text-gray-700">Program</h4>
        <Button size="sm" onClick={addProgramItem} variant="outline">
          Add Work
        </Button>
      </div>

      <div className="space-y-4">
        {program.map((item, index) => {
          const selectedComposerId = selectedComposers[index] || "";
          const availableWorks = selectedComposerId ? getWorksForComposer(selectedComposerId) : [];

          return (
            <div key={`${index}-${item.workId || "empty"}`} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveProgramItemUp(index)}
                      disabled={index === 0}
                      className={`p-1 rounded ${
                        index === 0
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                      title="Move up"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 14l5-5 5 5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveProgramItemDown(index)}
                      disabled={index === program.length - 1}
                      className={`p-1 rounded ${
                        index === program.length - 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                      title="Move down"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    </button>
                  </div>
                  <h5 className="text-sm font-medium text-gray-700">Work {index + 1}</h5>
                </div>
                <Button size="sm" variant="outline" onClick={() => removeProgramItem(index)}>
                  Remove
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Composer</label>
                    <SelectDropdown
                      options={composers.map((c) => ({ value: c.composerId, label: c.name }))}
                      value={selectedComposerId}
                      onChange={(e) => handleComposerChange(index, e.target.value)}
                      placeholder="Select composer"
                      fullWidth
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Work</label>
                    <SelectDropdown
                      options={availableWorks.map((w) => ({ value: w.workId, label: w.title }))}
                      value={item.workId}
                      onChange={(e) => updateProgramItem(index, "workId", e.target.value)}
                      placeholder={selectedComposerId ? "Select work" : "Select composer first"}
                      disabled={!selectedComposerId}
                      fullWidth
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <Checkbox
                    label="World Premiere"
                    checked={item.is_premiere}
                    onChange={(e) => updateProgramItem(index, "is_premiere", e.target.checked)}
                  />
                  <Checkbox
                    label="Commission"
                    checked={item.is_commission}
                    onChange={(e) => updateProgramItem(index, "is_commission", e.target.checked)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Notes</label>
                  <Textarea
                    value={item.notes || ""}
                    onChange={(e) => updateProgramItem(index, "notes", e.target.value)}
                    rows={2}
                    fullWidth
                    placeholder="Additional notes about this work..."
                  />
                </div>
              </div>
            </div>
          );
        })}

        {program.length === 0 && (
          <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg bg-white">
            <p>No works in program. Click &quot;Add Work&quot; to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CheckDataPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("seasons");
  const [seasons, setSeasons] = useState<SeasonWithConcerts[]>([]);
  const [composers, setComposers] = useState<Composer[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [musicians, setMusicians] = useState<Musician[]>([]);

  const [editingConcert, setEditingConcert] = useState<string | null>(null);
  const [editingComposer, setEditingComposer] = useState<string | null>(null);
  const [editingWork, setEditingWork] = useState<string | null>(null);
  const [editingVenue, setEditingVenue] = useState<string | null>(null);
  const [editingMusician, setEditingMusician] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  // Load all data on component mount
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([loadSeasons(), loadComposers(), loadWorks(), loadVenues(), loadMusicians()]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const loadSeasons = async () => {
    try {
      console.log("Loading seasons...");
      const response = await fetch("/api/seasons");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Seasons loaded:", data);

      // Ensure data is an array
      if (Array.isArray(data)) {
        setSeasons(data);
      } else {
        console.error("Seasons data is not an array:", data);
        setSeasons([]);
      }
    } catch (error) {
      console.error("Error loading seasons:", error);
      setSeasons([]); // Set empty array as fallback
    }
  };

  const loadComposers = async () => {
    try {
      console.log("Loading composers...");
      const response = await fetch("/api/composers");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Composers loaded:", data);

      // Ensure data is an array
      if (Array.isArray(data)) {
        setComposers(data);
      } else {
        console.error("Composers data is not an array:", data);
        setComposers([]);
      }
    } catch (error) {
      console.error("Error loading composers:", error);
      setComposers([]); // Set empty array as fallback
    }
  };

  const loadWorks = async () => {
    try {
      console.log("Loading works...");
      const response = await fetch("/api/works");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Works loaded:", data);

      // Ensure data is an array
      if (Array.isArray(data)) {
        setWorks(data);
      } else {
        console.error("Works data is not an array:", data);
        setWorks([]);
      }
    } catch (error) {
      console.error("Error loading works:", error);
      setWorks([]); // Set empty array as fallback
    }
  };

  const loadVenues = async () => {
    try {
      console.log("Loading venues...");
      const response = await fetch("/api/venues");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Venues loaded:", data);

      // Ensure data is an array
      if (Array.isArray(data)) {
        setVenues(data);
      } else {
        console.error("Venues data is not an array:", data);
        setVenues([]);
      }
    } catch (error) {
      console.error("Error loading venues:", error);
      setVenues([]); // Set empty array as fallback
    }
  };

  const loadMusicians = async () => {
    try {
      console.log("Loading musicians...");
      const response = await fetch("/api/musicians");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Musicians loaded:", data);

      // Ensure data is an array
      if (Array.isArray(data)) {
        setMusicians(data);
      } else {
        console.error("Musicians data is not an array:", data);
        setMusicians([]);
      }
    } catch (error) {
      console.error("Error loading musicians:", error);
      setMusicians([]); // Set empty array as fallback
    }
  };

  const saveConcert = async (concert: Concert) => {
    setSaving(concert.concertId);
    try {
      const response = await fetch("/api/concerts", {
        method: concert._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(concert),
      });

      if (response.ok) {
        await loadSeasons();
        setEditingConcert(null);
      } else {
        throw new Error("Failed to save concert");
      }
    } catch (error) {
      console.error("Error saving concert:", error);
      alert("Error saving concert");
    } finally {
      setSaving(null);
    }
  };

  const saveComposer = async (composer: Composer) => {
    setSaving(composer.composerId);
    try {
      const response = await fetch("/api/composers", {
        method: composer._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(composer),
      });

      if (response.ok) {
        await loadComposers();
        setEditingComposer(null);
      } else {
        throw new Error("Failed to save composer");
      }
    } catch (error) {
      console.error("Error saving composer:", error);
      alert("Error saving composer");
    } finally {
      setSaving(null);
    }
  };

  const saveWork = async (work: Work) => {
    setSaving(work.workId);
    try {
      const response = await fetch("/api/works", {
        method: work._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(work),
      });

      if (response.ok) {
        await loadWorks();
        setEditingWork(null);
      } else {
        throw new Error("Failed to save work");
      }
    } catch (error) {
      console.error("Error saving work:", error);
      alert("Error saving work");
    } finally {
      setSaving(null);
    }
  };

  const saveVenue = async (venue: Venue) => {
    setSaving(venue.venueId);
    try {
      const response = await fetch("/api/venues", {
        method: venue._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venue),
      });

      if (response.ok) {
        await loadVenues();
        setEditingVenue(null);
      } else {
        throw new Error("Failed to save venue");
      }
    } catch (error) {
      console.error("Error saving venue:", error);
      alert("Error saving venue");
    } finally {
      setSaving(null);
    }
  };

  const saveMusician = async (musician: Musician) => {
    setSaving(musician.musicianId);
    try {
      const response = await fetch("/api/musicians", {
        method: musician._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(musician),
      });

      if (response.ok) {
        await loadMusicians();
        setEditingMusician(null);
      } else {
        throw new Error("Failed to save musician");
      }
    } catch (error) {
      console.error("Error saving musician:", error);
      alert("Error saving musician");
    } finally {
      setSaving(null);
    }
  };

  const renderTabs = () => (
    <div className="border-b border-gray-200 mb-8">
      <nav className="-mb-px flex space-x-8">
        {[
          { key: "seasons", label: "Seasons & Concerts" },
          { key: "composers", label: "Composers" },
          { key: "works", label: "Works" },
          { key: "venues", label: "Venues" },
          { key: "musicians", label: "Musicians" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabType)}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.key
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">enSRQ Data</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">enSRQ Data</h1>

      {renderTabs()}

      {activeTab === "seasons" && (
        <SeasonsTab
          seasons={seasons}
          venues={venues}
          composers={composers}
          works={works}
          musicians={musicians}
          editingConcert={editingConcert}
          setEditingConcert={setEditingConcert}
          saveConcert={saveConcert}
          saving={saving}
        />
      )}

      {activeTab === "composers" && (
        <ComposersTab
          composers={composers}
          editingComposer={editingComposer}
          setEditingComposer={setEditingComposer}
          saveComposer={saveComposer}
          saving={saving}
        />
      )}

      {activeTab === "works" && (
        <WorksTab
          works={works}
          composers={composers}
          editingWork={editingWork}
          setEditingWork={setEditingWork}
          saveWork={saveWork}
          saving={saving}
        />
      )}

      {activeTab === "venues" && (
        <VenuesTab
          venues={venues}
          editingVenue={editingVenue}
          setEditingVenue={setEditingVenue}
          saveVenue={saveVenue}
          saving={saving}
        />
      )}

      {activeTab === "musicians" && (
        <MusiciansTab
          musicians={musicians}
          editingMusician={editingMusician}
          setEditingMusician={setEditingMusician}
          saveMusician={saveMusician}
          saving={saving}
        />
      )}
    </div>
  );
};

// Seasons Tab Component
const SeasonsTab: React.FC<{
  seasons: SeasonWithConcerts[];
  venues: Venue[];
  composers: Composer[];
  works: Work[];
  musicians: Musician[];
  editingConcert: string | null;
  setEditingConcert: (id: string | null) => void;
  saveConcert: (concert: Concert) => void;
  saving: string | null;
}> = ({ seasons, venues, composers, works, editingConcert, setEditingConcert, saveConcert, saving }) => {
  return (
    <div className="space-y-8">
      {seasons.map((season) => (
        <div key={season.seasonId} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 capitalize">
            {season.seasonId.replace("s", "Season ").replace(/(\d+)/, "$1")}
          </h2>

          <div className="space-y-4">
            {season.concerts.map((concert) => (
              <ConcertCard
                key={concert.concertId}
                concert={concert}
                venues={venues}
                composers={composers}
                works={works}
                isEditing={editingConcert === concert.concertId}
                onEdit={() => setEditingConcert(concert.concertId)}
                onCancel={() => setEditingConcert(null)}
                onSave={saveConcert}
                saving={saving === concert.concertId}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Concert Card Component
const ConcertCard: React.FC<{
  concert: Concert;
  venues: Venue[];
  composers: Composer[];
  works: Work[];
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (concert: Concert) => void;
  saving: boolean;
}> = ({ concert, venues, composers, works, isEditing, onEdit, onCancel, onSave, saving }) => {
  const [editedConcert, setEditedConcert] = useState<Concert>(concert);

  useEffect(() => {
    setEditedConcert(concert);
  }, [concert]);

  const handleSave = () => {
    onSave(editedConcert);
  };

  const getVenueName = (venueId: string) => {
    const venue = venues.find((v) => v.venueId === venueId);
    return venue?.name || venueId;
  };

  if (isEditing) {
    return (
      <div className="border border-blue-300 rounded-lg p-6 bg-blue-50">
        {/* Header Section - Editing Mode */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <InputField
                value={editedConcert.title}
                onChange={(e) => setEditedConcert({ ...editedConcert, title: e.target.value })}
                fullWidth
                className="text-xl font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <InputField
                value={editedConcert.subtitle || ""}
                onChange={(e) => setEditedConcert({ ...editedConcert, subtitle: e.target.value })}
                fullWidth
                className="text-lg"
              />
            </div>
          </div>
          <div className="flex gap-2 shrink-0 ml-4">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <InputField
                type="date"
                value={editedConcert.date}
                onChange={(e) => setEditedConcert({ ...editedConcert, date: e.target.value })}
                fullWidth
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
              <SelectDropdown
                options={venues.map((v) => ({ value: v.venueId, label: v.name }))}
                value={editedConcert.venueId}
                onChange={(e) => setEditedConcert({ ...editedConcert, venueId: e.target.value })}
                placeholder="Select venue"
                fullWidth
              />
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <Textarea
            value={editedConcert.description || ""}
            onChange={(e) => setEditedConcert({ ...editedConcert, description: e.target.value })}
            rows={3}
            fullWidth
          />
        </div>

        {/* Ticket Information Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Ticket Information</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Live Tickets */}
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <h5 className="text-sm font-medium text-gray-700 mb-3">Live Tickets</h5>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Price ($)</label>
                  <InputField
                    type="number"
                    min="0"
                    step="0.01"
                    value={editedConcert.ticketsLinks?.singleLive?.price?.toString() || ""}
                    onChange={(e) => {
                      const price = parseFloat(e.target.value) || 0;
                      setEditedConcert({
                        ...editedConcert,
                        ticketsLinks: {
                          ...editedConcert.ticketsLinks,
                          singleLive: {
                            ...editedConcert.ticketsLinks?.singleLive,
                            price,
                            url: editedConcert.ticketsLinks?.singleLive?.url || "",
                          },
                        },
                      });
                    }}
                    fullWidth
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Purchase URL</label>
                  <InputField
                    type="url"
                    value={editedConcert.ticketsLinks?.singleLive?.url || ""}
                    onChange={(e) => {
                      setEditedConcert({
                        ...editedConcert,
                        ticketsLinks: {
                          ...editedConcert.ticketsLinks,
                          singleLive: {
                            ...editedConcert.ticketsLinks?.singleLive,
                            price: editedConcert.ticketsLinks?.singleLive?.price || 0,
                            url: e.target.value,
                          },
                        },
                      });
                    }}
                    fullWidth
                    placeholder="https://example.com/tickets"
                  />
                </div>
              </div>
            </div>

            {/* Streaming Tickets */}
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <h5 className="text-sm font-medium text-gray-700 mb-3">Streaming Access</h5>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Price ($)</label>
                  <InputField
                    type="number"
                    min="0"
                    step="0.01"
                    value={editedConcert.ticketsLinks?.singleStreaming?.price?.toString() || ""}
                    onChange={(e) => {
                      const price = parseFloat(e.target.value) || 0;
                      setEditedConcert({
                        ...editedConcert,
                        ticketsLinks: {
                          ...editedConcert.ticketsLinks,
                          singleStreaming: {
                            ...editedConcert.ticketsLinks?.singleStreaming,
                            price,
                            url: editedConcert.ticketsLinks?.singleStreaming?.url || "",
                          },
                        },
                      });
                    }}
                    fullWidth
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Purchase URL</label>
                  <InputField
                    type="url"
                    value={editedConcert.ticketsLinks?.singleStreaming?.url || ""}
                    onChange={(e) => {
                      setEditedConcert({
                        ...editedConcert,
                        ticketsLinks: {
                          ...editedConcert.ticketsLinks,
                          singleStreaming: {
                            ...editedConcert.ticketsLinks?.singleStreaming,
                            price: editedConcert.ticketsLinks?.singleStreaming?.price || 0,
                            url: e.target.value,
                          },
                        },
                      });
                    }}
                    fullWidth
                    placeholder="https://example.com/streaming"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Program Section */}
        <ProgramEditor
          program={editedConcert.program}
          composers={composers}
          works={works}
          onChange={(program) => setEditedConcert({ ...editedConcert, program })}
        />
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{concert.title}</h3>
          {concert.subtitle && <p className="text-lg text-gray-600 mb-2">{concert.subtitle}</p>}
          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            <span>
              <strong>Date:</strong> {new Date(concert.date).toLocaleDateString()}
            </span>
            <span>
              <strong>Venue:</strong> {getVenueName(concert.venueId)}
            </span>
          </div>
        </div>
        <Button size="sm" onClick={onEdit} className="shrink-0">
          Edit
        </Button>
      </div>

      {/* Description Section */}
      {concert.description && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
          <p className="text-gray-700 leading-relaxed">{concert.description}</p>
        </div>
      )}

      {/* Ticket Information Section */}
      {(concert.ticketsLinks?.singleLive || concert.ticketsLinks?.singleStreaming) && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Ticket Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {concert.ticketsLinks?.singleLive && (
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Live Tickets</h5>
                <p className="text-lg font-semibold text-gray-900 mb-1">${concert.ticketsLinks.singleLive.price}</p>
                {concert.ticketsLinks.singleLive.url && (
                  <a
                    href={concert.ticketsLinks.singleLive.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    Buy Live Tickets →
                  </a>
                )}
              </div>
            )}
            {concert.ticketsLinks?.singleStreaming && (
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Streaming Access</h5>
                <p className="text-lg font-semibold text-gray-900 mb-1">
                  ${concert.ticketsLinks.singleStreaming.price}
                </p>
                {concert.ticketsLinks.singleStreaming.url && (
                  <a
                    href={concert.ticketsLinks.singleStreaming.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    Buy Streaming Access →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Program Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Program</h4>
        <div className="space-y-3">
          {concert.program.map((item, index) => {
            const work = works.find((w) => w.workId === item.workId);
            const composer = composers.find((c) => c.composerId === work?.composerId);

            return (
              <div
                key={`program-${index}-${item.workId}`}
                className="grid grid-cols-[1fr,2fr,1fr] border-l-4 border-blue-200 pl-4 py-2"
              >
                <p className="font-semibold text-gray-900 text-lg">{composer?.name || "Unknown Composer"}</p>
                <p className="text-gray-800 font-medium">{work?.title || item.workId}</p>
                <div className="flex flex-row justify-end kode-mono gap-3 text-sm text-gray-600 mt-1 text-right">
                  {work?.year && <span>({work.year})</span>}
                  {work?.duration && <span>{work.duration}</span>}
                  {item.is_premiere && <span className="text-red-600 font-medium">World Premiere</span>}
                  {item.is_commission && <span className="text-blue-600 font-medium">Commission</span>}
                </div>
                {item.notes && <p className="text-sm text-gray-600 italic mt-1">{item.notes}</p>}
              </div>
            );
          })}
          {concert.program.length === 0 && <p className="text-gray-500 italic">No program information available</p>}
        </div>
      </div>
    </div>
  );
};

// Composers Tab Component
const ComposersTab: React.FC<{
  composers: Composer[];
  editingComposer: string | null;
  setEditingComposer: (id: string | null) => void;
  saveComposer: (composer: Composer) => void;
  saving: string | null;
}> = ({ composers, editingComposer, setEditingComposer, saveComposer, saving }) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredComposers, setFilteredComposers] = useState(composers);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredComposers(composers);
    } else {
      const filtered = composers.filter(
        (composer) =>
          composer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (composer.nationality && composer.nationality.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredComposers(filtered);
    }
  }, [searchTerm, composers]);

  const handleCreateNew = () => {
    const newComposer: Composer = {
      composerId: `composer-${Date.now()}`,
      name: "",
      nationality: "",
      born: undefined,
      died: undefined,
    };
    setIsCreatingNew(true);
    setEditingComposer(newComposer.composerId);
    // Add to the beginning of the list temporarily
    setFilteredComposers([newComposer, ...filteredComposers]);
  };

  const handleCancelNew = () => {
    setIsCreatingNew(false);
    setEditingComposer(null);
    // Remove the temporary new composer
    setFilteredComposers((prev) => prev.filter((c) => !c.composerId.startsWith("composer-")));
  };

  const handleSaveNew = (composer: Composer) => {
    setIsCreatingNew(false);
    saveComposer(composer);
    // The list will be refreshed from the server after save
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-md">
          <InputField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search composers..."
            fullWidth
          />
        </div>
        <Button onClick={handleCreateNew} disabled={isCreatingNew}>
          Add New Composer
        </Button>
      </div>

      {filteredComposers.map((composer) => (
        <ComposerCard
          key={composer.composerId}
          composer={composer}
          isEditing={editingComposer === composer.composerId}
          onEdit={() => setEditingComposer(composer.composerId)}
          onCancel={
            isCreatingNew && editingComposer === composer.composerId ? handleCancelNew : () => setEditingComposer(null)
          }
          onSave={isCreatingNew && editingComposer === composer.composerId ? handleSaveNew : saveComposer}
          saving={saving === composer.composerId}
        />
      ))}

      {filteredComposers.length === 0 && searchTerm && (
        <div className="text-center py-8 text-gray-500">
          <p>No composers found matching &quot;{searchTerm}&quot;</p>
          <Button onClick={handleCreateNew} className="mt-4">
            Create New Composer
          </Button>
        </div>
      )}
    </div>
  );
};

// Composer Card Component
const ComposerCard: React.FC<{
  composer: Composer;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (composer: Composer) => void;
  saving: boolean;
}> = ({ composer, isEditing, onEdit, onCancel, onSave, saving }) => {
  const [editedComposer, setEditedComposer] = useState<Composer>(composer);

  useEffect(() => {
    setEditedComposer(composer);
  }, [composer]);

  const handleSave = () => {
    onSave(editedComposer);
  };

  if (isEditing) {
    return (
      <div className="border border-blue-300 rounded-lg p-4 bg-blue-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <InputField
              value={editedComposer.name}
              onChange={(e) => setEditedComposer({ ...editedComposer, name: e.target.value })}
              fullWidth
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
            <InputField
              value={editedComposer.nationality || ""}
              onChange={(e) => setEditedComposer({ ...editedComposer, nationality: e.target.value })}
              fullWidth
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Born</label>
            <InputField
              type="number"
              value={editedComposer.born?.toString() || ""}
              onChange={(e) => setEditedComposer({ ...editedComposer, born: parseInt(e.target.value) || undefined })}
              fullWidth
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Died</label>
            <InputField
              type="number"
              value={editedComposer.died?.toString() || ""}
              onChange={(e) => setEditedComposer({ ...editedComposer, died: parseInt(e.target.value) || undefined })}
              fullWidth
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="">
          <h3 className="text-xl font-semibold">{composer.name}</h3>
          <div className="text-gray-600 space-x-4">
            {composer.nationality && <span>{composer.nationality}</span>}
            {composer.born && (
              <span>
                {composer.born}
                {composer.died ? ` - ${composer.died}` : " - present"}
              </span>
            )}
          </div>
        </div>
        <Button size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>
    </div>
  );
};

const WorksTab: React.FC<{
  works: Work[];
  composers: Composer[];
  editingWork: string | null;
  setEditingWork: (id: string | null) => void;
  saveWork: (work: Work) => void;
  saving: string | null;
}> = ({ works, composers, editingWork, setEditingWork, saveWork, saving }) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWorks, setFilteredWorks] = useState(works);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredWorks(works);
    } else {
      const filtered = works.filter((work) => {
        const composer = composers.find((c) => c.composerId === work.composerId);
        return (
          work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (work.subtitle && work.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (composer && composer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (work.year && work.year.includes(searchTerm))
        );
      });
      setFilteredWorks(filtered);
    }
  }, [searchTerm, works, composers]);

  const handleCreateNew = () => {
    const newWork: Work = {
      workId: `work-${Date.now()}`,
      composerId: "",
      title: "",
      subtitle: "",
      year: "",
      duration: "",
      instrumentation: [],
      description: "",
    };
    setIsCreatingNew(true);
    setEditingWork(newWork.workId);
    // Add to the beginning of the list temporarily
    setFilteredWorks([newWork, ...filteredWorks]);
  };

  const handleCancelNew = () => {
    setIsCreatingNew(false);
    setEditingWork(null);
    // Remove the temporary new work
    setFilteredWorks((prev) => prev.filter((w) => !w.workId.startsWith("work-")));
  };

  const handleSaveNew = (work: Work) => {
    setIsCreatingNew(false);
    saveWork(work);
    // The list will be refreshed from the server after save
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-md">
          <InputField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search works..."
            fullWidth
          />
        </div>
        <Button onClick={handleCreateNew} disabled={isCreatingNew}>
          Add New Work
        </Button>
      </div>

      {filteredWorks.map((work) => (
        <WorkCard
          key={work.workId}
          work={work}
          composers={composers}
          isEditing={editingWork === work.workId}
          onEdit={() => setEditingWork(work.workId)}
          onCancel={isCreatingNew && editingWork === work.workId ? handleCancelNew : () => setEditingWork(null)}
          onSave={isCreatingNew && editingWork === work.workId ? handleSaveNew : saveWork}
          saving={saving === work.workId}
        />
      ))}

      {filteredWorks.length === 0 && searchTerm && (
        <div className="text-center py-8 text-gray-500">
          <p>No works found matching &quot;{searchTerm}&quot;</p>
          <Button onClick={handleCreateNew} className="mt-4">
            Create New Work
          </Button>
        </div>
      )}
    </div>
  );
};

// Work Card Component
const WorkCard: React.FC<{
  work: Work;
  composers: Composer[];
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (work: Work) => void;
  saving: boolean;
}> = ({ work, composers, isEditing, onEdit, onCancel, onSave, saving }) => {
  const [editedWork, setEditedWork] = useState<Work>(work);

  useEffect(() => {
    setEditedWork(work);
  }, [work]);

  const handleSave = () => {
    onSave(editedWork);
  };

  const getComposerName = (composerId: string) => {
    const composer = composers.find((c) => c.composerId === composerId);
    return composer?.name || composerId;
  };

  if (isEditing) {
    return (
      <div className="border border-blue-300 rounded-lg p-4 bg-blue-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Composer</label>
            <SelectDropdown
              options={composers.map((c) => ({ value: c.composerId, label: c.name }))}
              value={editedWork.composerId}
              onChange={(e) => setEditedWork({ ...editedWork, composerId: e.target.value })}
              placeholder="Select composer"
              fullWidth
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <InputField
              value={editedWork.title}
              onChange={(e) => setEditedWork({ ...editedWork, title: e.target.value })}
              fullWidth
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <InputField
              value={editedWork.subtitle || ""}
              onChange={(e) => setEditedWork({ ...editedWork, subtitle: e.target.value })}
              fullWidth
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <InputField
              value={editedWork.year || ""}
              onChange={(e) => setEditedWork({ ...editedWork, year: e.target.value })}
              fullWidth
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <InputField
              value={editedWork.duration || ""}
              onChange={(e) => setEditedWork({ ...editedWork, duration: e.target.value })}
              fullWidth
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <Textarea
            value={editedWork.description || ""}
            onChange={(e) => setEditedWork({ ...editedWork, description: e.target.value })}
            rows={3}
            fullWidth
          />
        </div>

        {/* Instrumentation Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">Instrumentation</label>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const newInstrumentation = [...(editedWork.instrumentation || []), { instrument: "", count: 1 }];
                setEditedWork({ ...editedWork, instrumentation: newInstrumentation });
              }}
            >
              Add Instrument
            </Button>
          </div>

          <div className="space-y-3">
            {(editedWork.instrumentation || []).map((inst, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      if (index === 0) return;
                      const newInstrumentation = [...(editedWork.instrumentation || [])];
                      [newInstrumentation[index - 1], newInstrumentation[index]] = [
                        newInstrumentation[index],
                        newInstrumentation[index - 1],
                      ];
                      setEditedWork({ ...editedWork, instrumentation: newInstrumentation });
                    }}
                    disabled={index === 0}
                    className={`p-1 rounded ${
                      index === 0
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    title="Move up"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 14l5-5 5 5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      if (index === (editedWork.instrumentation || []).length - 1) return;
                      const newInstrumentation = [...(editedWork.instrumentation || [])];
                      [newInstrumentation[index], newInstrumentation[index + 1]] = [
                        newInstrumentation[index + 1],
                        newInstrumentation[index],
                      ];
                      setEditedWork({ ...editedWork, instrumentation: newInstrumentation });
                    }}
                    disabled={index === (editedWork.instrumentation || []).length - 1}
                    className={`p-1 rounded ${
                      index === (editedWork.instrumentation || []).length - 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    title="Move down"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1">
                  <InputField
                    value={inst.instrument}
                    onChange={(e) => {
                      const newInstrumentation = [...(editedWork.instrumentation || [])];
                      newInstrumentation[index] = { ...newInstrumentation[index], instrument: e.target.value };
                      setEditedWork({ ...editedWork, instrumentation: newInstrumentation });
                    }}
                    placeholder="Instrument name"
                    fullWidth
                  />
                </div>

                <div className="w-20">
                  <InputField
                    type="number"
                    min="1"
                    value={inst.count.toString()}
                    onChange={(e) => {
                      const newInstrumentation = [...(editedWork.instrumentation || [])];
                      newInstrumentation[index] = {
                        ...newInstrumentation[index],
                        count: parseInt(e.target.value) || 1,
                      };
                      setEditedWork({ ...editedWork, instrumentation: newInstrumentation });
                    }}
                    placeholder="Count"
                    fullWidth
                  />
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newInstrumentation = (editedWork.instrumentation || []).filter((_, i) => i !== index);
                    setEditedWork({ ...editedWork, instrumentation: newInstrumentation });
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}

            {(!editedWork.instrumentation || editedWork.instrumentation.length === 0) && (
              <div className="text-center py-4 text-gray-500 border border-gray-200 rounded-lg bg-white">
                <p>No instrumentation specified. Click &quot;Add Instrument&quot; to get started.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="grid grid-cols-[4fr,7fr,1fr,1fr] gap-4 w-full">
          <p className="text-lg text-gray-700">{getComposerName(work.composerId)}</p>
          <div className="work-title-subtitle">
            <h3 className="text-xl font-semibold">{work.title}</h3>
            {work.subtitle && <p className="text-gray-600">{work.subtitle}</p>}
          </div>
          <div className="work-year">{work.year && <span>({work.year})</span>}</div>
          <div className="work-duration">{work.duration && <span>{work.duration}</span>}</div>
          {work.description && <p className="text-gray-700 mt-2 col-span-4">{work.description}</p>}
          {work.instrumentation && work.instrumentation.length > 0 && (
            <div className="mt-2 col-span-4">
              <strong>Instrumentation:</strong>{" "}
              {work.instrumentation
                .map((inst) => `${inst.instrument}${inst.count > 1 ? ` (${inst.count})` : ""}`)
                .join(", ")}
            </div>
          )}
        </div>
        <Button size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>
    </div>
  );
};

const VenuesTab: React.FC<{
  venues: Venue[];
  editingVenue: string | null;
  setEditingVenue: (id: string | null) => void;
  saveVenue: (venue: Venue) => void;
  saving: string | null;
}> = ({ venues, editingVenue, setEditingVenue, saveVenue, saving }) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVenues, setFilteredVenues] = useState(venues);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredVenues(venues);
    } else {
      const filtered = venues.filter(
        (venue) =>
          venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (venue.address && venue.address.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredVenues(filtered);
    }
  }, [searchTerm, venues]);

  const handleCreateNew = () => {
    const newVenue: Venue = {
      venueId: `venue-${Date.now()}`,
      name: "",
      address: "",
    };
    setIsCreatingNew(true);
    setEditingVenue(newVenue.venueId);
    // Add to the beginning of the list temporarily
    setFilteredVenues([newVenue, ...filteredVenues]);
  };

  const handleCancelNew = () => {
    setIsCreatingNew(false);
    setEditingVenue(null);
    // Remove the temporary new venue
    setFilteredVenues((prev) => prev.filter((v) => !v.venueId.startsWith("venue-")));
  };

  const handleSaveNew = (venue: Venue) => {
    setIsCreatingNew(false);
    saveVenue(venue);
    // The list will be refreshed from the server after save
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-md">
          <InputField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search venues..."
            fullWidth
          />
        </div>
        <Button onClick={handleCreateNew} disabled={isCreatingNew}>
          Add New Venue
        </Button>
      </div>

      {filteredVenues.map((venue) => (
        <VenueCard
          key={venue.venueId}
          venue={venue}
          isEditing={editingVenue === venue.venueId}
          onEdit={() => setEditingVenue(venue.venueId)}
          onCancel={isCreatingNew && editingVenue === venue.venueId ? handleCancelNew : () => setEditingVenue(null)}
          onSave={isCreatingNew && editingVenue === venue.venueId ? handleSaveNew : saveVenue}
          saving={saving === venue.venueId}
        />
      ))}

      {filteredVenues.length === 0 && searchTerm && (
        <div className="text-center py-8 text-gray-500">
          <p>No venues found matching &quot;{searchTerm}&quot;</p>
          <Button onClick={handleCreateNew} className="mt-4">
            Create New Venue
          </Button>
        </div>
      )}
    </div>
  );
};

// Venue Card Component
const VenueCard: React.FC<{
  venue: Venue;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (venue: Venue) => void;
  saving: boolean;
}> = ({ venue, isEditing, onEdit, onCancel, onSave, saving }) => {
  const [editedVenue, setEditedVenue] = useState<Venue>(venue);

  useEffect(() => {
    setEditedVenue(venue);
  }, [venue]);

  const handleSave = () => {
    onSave(editedVenue);
  };

  if (isEditing) {
    return (
      <div className="border border-blue-300 rounded-lg p-4 bg-blue-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <InputField
              value={editedVenue.name}
              onChange={(e) => setEditedVenue({ ...editedVenue, name: e.target.value })}
              fullWidth
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <InputField
              value={editedVenue.address || ""}
              onChange={(e) => setEditedVenue({ ...editedVenue, address: e.target.value })}
              fullWidth
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">{venue.name}</h3>
          {venue.address && <p className="text-gray-600">{venue.address}</p>}
        </div>
        <Button size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>
    </div>
  );
};

const MusiciansTab: React.FC<{
  musicians: Musician[];
  editingMusician: string | null;
  setEditingMusician: (id: string | null) => void;
  saveMusician: (musician: Musician) => void;
  saving: string | null;
}> = ({ musicians, editingMusician, setEditingMusician, saveMusician, saving }) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMusicians, setFilteredMusicians] = useState(musicians);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMusicians(musicians);
    } else {
      const filtered = musicians.filter((musician) => musician.name.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredMusicians(filtered);
    }
  }, [searchTerm, musicians]);

  const handleCreateNew = () => {
    const newMusician: Musician = {
      musicianId: `musician-${Date.now()}`,
      name: "",
    };
    setIsCreatingNew(true);
    setEditingMusician(newMusician.musicianId);
    // Add to the beginning of the list temporarily
    setFilteredMusicians([newMusician, ...filteredMusicians]);
  };

  const handleCancelNew = () => {
    setIsCreatingNew(false);
    setEditingMusician(null);
    // Remove the temporary new musician
    setFilteredMusicians((prev) => prev.filter((m) => !m.musicianId.startsWith("musician-")));
  };

  const handleSaveNew = (musician: Musician) => {
    setIsCreatingNew(false);
    saveMusician(musician);
    // The list will be refreshed from the server after save
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-md">
          <InputField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search musicians..."
            fullWidth
          />
        </div>
        <Button onClick={handleCreateNew} disabled={isCreatingNew}>
          Add New Musician
        </Button>
      </div>

      {filteredMusicians.map((musician) => (
        <MusicianCard
          key={musician.musicianId}
          musician={musician}
          isEditing={editingMusician === musician.musicianId}
          onEdit={() => setEditingMusician(musician.musicianId)}
          onCancel={
            isCreatingNew && editingMusician === musician.musicianId ? handleCancelNew : () => setEditingMusician(null)
          }
          onSave={isCreatingNew && editingMusician === musician.musicianId ? handleSaveNew : saveMusician}
          saving={saving === musician.musicianId}
        />
      ))}

      {filteredMusicians.length === 0 && searchTerm && (
        <div className="text-center py-8 text-gray-500">
          <p>No musicians found matching &quot;{searchTerm}&quot;</p>
          <Button onClick={handleCreateNew} className="mt-4">
            Create New Musician
          </Button>
        </div>
      )}
    </div>
  );
};

// Musician Card Component
const MusicianCard: React.FC<{
  musician: Musician;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (musician: Musician) => void;
  saving: boolean;
}> = ({ musician, isEditing, onEdit, onCancel, onSave, saving }) => {
  const [editedMusician, setEditedMusician] = useState<Musician>(musician);

  useEffect(() => {
    setEditedMusician(musician);
  }, [musician]);

  const handleSave = () => {
    onSave(editedMusician);
  };

  if (isEditing) {
    return (
      <div className="border border-blue-300 rounded-lg p-4 bg-blue-50">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <InputField
            value={editedMusician.name}
            onChange={(e) => setEditedMusician({ ...editedMusician, name: e.target.value })}
            fullWidth
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">{musician.name}</h3>
        </div>
        <Button size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>
    </div>
  );
};

export default CheckDataPage;
