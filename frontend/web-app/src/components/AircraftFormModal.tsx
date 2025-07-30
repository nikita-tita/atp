import React, { useState, useEffect } from 'react';
import { XMarkIcon, PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface AircraftFormData {
  manufacturer: string;
  model: string;
  series: string;
  registration: string;
  year: number;
  ttaf: number;
  landings: number;
  price: string;
  currency: string;
  location: string;
  mtow: string;
  engines: number;
  engineType: string;
  maintenancePlan: string;
  interior: string;
  passengers: number;
  color: string;
  description: string;
  images: string[];
  documents: string[];
}

interface AircraftFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (aircraft: AircraftFormData) => void;
  aircraft?: AircraftFormData | null;
  mode: 'add' | 'edit';
}

const AircraftFormModal: React.FC<AircraftFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  aircraft,
  mode
}) => {
  const [formData, setFormData] = useState<AircraftFormData>({
    manufacturer: '',
    model: '',
    series: '',
    registration: '',
    year: new Date().getFullYear(),
    ttaf: 0,
    landings: 0,
    price: '',
    currency: 'USD',
    location: '',
    mtow: '',
    engines: 2,
    engineType: '',
    maintenancePlan: '',
    interior: '',
    passengers: 0,
    color: '',
    description: '',
    images: [],
    documents: []
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'technical' | 'media'>('basic');

  useEffect(() => {
    if (aircraft && mode === 'edit') {
      setFormData(aircraft);
    }
  }, [aircraft, mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.manufacturer || !formData.model || !formData.registration || !formData.price) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (formData.year < 1950 || formData.year > new Date().getFullYear()) {
      toast.error('Некорректный год выпуска');
      return;
    }

    if (formData.ttaf < 0 || formData.landings < 0) {
      toast.error('Некорректные данные о наработке');
      return;
    }

    onSave(formData);
    toast.success(mode === 'add' ? 'Объявление добавлено!' : 'Объявление обновлено!');
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            {mode === 'add' ? 'Добавить объявление' : 'Редактировать объявление'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'basic'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Основная информация
            </button>
            <button
              onClick={() => setActiveTab('technical')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'technical'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Технические характеристики
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'media'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Медиа и документы
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Производитель *
                  </label>
                  <select
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  >
                    <option value="">Выберите производителя</option>
                    <option value="Gulfstream">Gulfstream</option>
                    <option value="Bombardier">Bombardier</option>
                    <option value="Cessna">Cessna</option>
                    <option value="Dassault">Dassault</option>
                    <option value="Boeing">Boeing</option>
                    <option value="Airbus">Airbus</option>
                    <option value="Embraer">Embraer</option>
                    <option value="Hawker">Hawker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Модель *
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Например: G650"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Серия
                  </label>
                  <input
                    type="text"
                    name="series"
                    value={formData.series}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Например: 6062"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Регистрационный номер *
                  </label>
                  <input
                    type="text"
                    name="registration"
                    value={formData.registration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Например: N123AB"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Год выпуска *
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="1950"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Цена *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Например: 45000000"
                      required
                    />
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="RUB">RUB</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Местоположение
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Например: Москва, Россия"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Цвет
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Например: Белый с золотыми полосами"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Подробное описание самолета, его состояние, особенности..."
                />
              </div>
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TTAF (часы налета)
                  </label>
                  <input
                    type="number"
                    name="ttaf"
                    value={formData.ttaf}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Количество посадок
                  </label>
                  <input
                    type="number"
                    name="landings"
                    value={formData.landings}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MTOW (максимальная взлетная масса)
                  </label>
                  <input
                    type="text"
                    name="mtow"
                    value={formData.mtow}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Например: 99,598 Lbs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Количество двигателей
                  </label>
                  <input
                    type="number"
                    name="engines"
                    value={formData.engines}
                    onChange={handleInputChange}
                    min="1"
                    max="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип двигателей
                  </label>
                  <input
                    type="text"
                    name="engineType"
                    value={formData.engineType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Например: RR BR700-725A1-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    План обслуживания
                  </label>
                  <input
                    type="text"
                    name="maintenancePlan"
                    value={formData.maintenancePlan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Например: RR CorporateCare"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Интерьер
                  </label>
                  <input
                    type="text"
                    name="interior"
                    value={formData.interior}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Например: Executive"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Количество пассажиров
                  </label>
                  <input
                    type="number"
                    name="passengers"
                    value={formData.passengers}
                    onChange={handleInputChange}
                    min="1"
                    max="50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Фотографии самолета
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                    >
                      Загрузить фотографии
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    PNG, JPG до 10MB
                  </p>
                </div>

                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Фото ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Документы
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="document-upload"
                    />
                    <label
                      htmlFor="document-upload"
                      className="cursor-pointer bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                    >
                      Загрузить документы
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    PDF, DOC до 20MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="flex space-x-4">
              {activeTab === 'technical' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('basic')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  ← Назад
                </button>
              )}
              {activeTab === 'media' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('technical')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  ← Назад
                </button>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Отмена
              </button>
              {activeTab === 'basic' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('technical')}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Далее →
                </button>
              )}
              {activeTab === 'technical' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('media')}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Далее →
                </button>
              )}
              {activeTab === 'media' && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  {mode === 'add' ? 'Добавить объявление' : 'Сохранить изменения'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AircraftFormModal; 