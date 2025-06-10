
import React, { useState, useRef } from 'react';
import { Plus, Upload, Send, DollarSign, Package, Clock, CheckCircle, User, Menu, X, Camera, FileText } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('inquiries');
  const [inquiries, setInquiries] = useState([
    {
      id: 'INQ001',
      projectName: 'Downtown Office Building',
      status: 'Quoted',
      date: '2025-01-05',
      products: [
        { type: 'Steel Beams', quantity: 50, unit: 'pieces' },
        { type: 'Cement', quantity: 100, unit: 'bags' }
      ],
      totalAmount: 45000,
      commission: 4500
    }
  ]);
  
  const [orders, setOrders] = useState([
    {
      id: 'SO2025-001',
      projectName: 'Downtown Office Building',
      status: 'Paid',
      totalAmount: 45000,
      paidAmount: 45000,
      deliveryDate: '2025-01-15',
      commission: 4500,
      commissionPaid: true
    }
  ]);

  const [newInquiry, setNewInquiry] = useState({
    projectName: '',
    deliveryAddress: '',
    expectedDate: '',
    needsTransport: false,
    products: [{ type: '', thickness: '', color: '', length: '', quantity: '', remarks: '' }]
  });

  const [showNewInquiry, setShowNewInquiry] = useState(false);
  const fileInputRef = useRef(null);

  const addProduct = () => {
    setNewInquiry(prev => ({
      ...prev,
      products: [...prev.products, { type: '', thickness: '', color: '', length: '', quantity: '', remarks: '' }]
    }));
  };

  const updateProduct = (index, field, value) => {
    const updatedProducts = [...newInquiry.products];
    updatedProducts[index][field] = value;
    setNewInquiry(prev => ({ ...prev, products: updatedProducts }));
  };

  const submitInquiry = () => {
    const inquiry = {
      id: `INQ${String(inquiries.length + 1).padStart(3, '0')}`,
      projectName: newInquiry.projectName,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      products: newInquiry.products
        .filter(p => p.type && p.quantity)
        .map(p => ({
          type: p.type,
          quantity: parseInt(p.quantity) || 0,
          unit: getDefaultUnit(p.type)
        })),
      totalAmount: 0,
      commission: 0
    };
    
    setInquiries(prev => [...prev, inquiry]);
    setNewInquiry({
      projectName: '',
      deliveryAddress: '',
      expectedDate: '',
      needsTransport: false,
      products: [{ type: '', thickness: '', color: '', length: '', quantity: '', remarks: '' }]
    });
    setShowNewInquiry(false);
  };

  const getDefaultUnit = (productType) => {
    switch (productType) {
      case 'Steel Beams': return 'pieces';
      case 'Cement': return 'bags';
      case 'Rebar': return 'pieces';
      case 'Pipes': return 'pieces';
      case 'Concrete Blocks': return 'pieces';
      default: return 'units';
    }
  };

  const totalCommissions = orders
    .filter(order => order.commissionPaid)
    .reduce((sum, order) => sum + order.commission, 0);

  const pendingCommissions = orders
    .filter(order => !order.commissionPaid && order.status === 'Completed')
    .reduce((sum, order) => sum + order.commission, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="h-10 w-10" />
              <div>
                <h1 className="text-2xl font-bold">ConstructMate</h1>
                <p className="text-blue-100 text-sm">Materials Sales Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-blue-500 bg-opacity-50 rounded-lg px-3 py-2">
              <User className="h-6 w-6" />
              <span className="text-sm font-medium">John Engineer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4">
          <div className="flex space-x-8">
            {[
              { id: 'inquiries', label: 'Inquiries', icon: FileText },
              { id: 'orders', label: 'Orders', icon: Package },
              { id: 'commissions', label: 'Commissions', icon: DollarSign }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-7xl mx-auto">
        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">Material Inquiries</h2>
              <button
                onClick={() => setShowNewInquiry(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors shadow-md"
              >
                <Plus className="h-5 w-5" />
                <span>New Inquiry</span>
              </button>
            </div>

            {showNewInquiry && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Submit New Inquiry</h3>
                  <button
                    onClick={() => setShowNewInquiry(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Project Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Name *
                      </label>
                      <input
                        type="text"
                        value={newInquiry.projectName}
                        onChange={(e) => setNewInquiry(prev => ({ ...prev, projectName: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter project name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Delivery Date
                      </label>
                      <input
                        type="date"
                        value={newInquiry.expectedDate}
                        onChange={(e) => setNewInquiry(prev => ({ ...prev, expectedDate: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address
                    </label>
                    <textarea
                      value={newInquiry.deliveryAddress}
                      onChange={(e) => setNewInquiry(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      rows={3}
                      placeholder="Enter complete delivery address"
                    />
                  </div>

                  {/* Products */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Products Required *
                      </label>
                      <button
                        onClick={addProduct}
                        className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm font-medium transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Product</span>
                      </button>
                    </div>

                    {newInquiry.products.map((product, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                              Product Type *
                            </label>
                            <select
                              value={product.type}
                              onChange={(e) => updateProduct(index, 'type', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                              <option value="">Select type</option>
                              <option value="Steel Beams">Steel Beams</option>
                              <option value="Cement">Cement</option>
                              <option value="Rebar">Rebar</option>
                              <option value="Pipes">Pipes</option>
                              <option value="Concrete Blocks">Concrete Blocks</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                              Quantity *
                            </label>
                            <input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder="Enter quantity"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                              Specifications
                            </label>
                            <input
                              type="text"
                              value={product.thickness}
                              onChange={(e) => updateProduct(index, 'thickness', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder="Size, grade, etc."
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-xs font-medium text-gray-600 mb-2">
                            Remarks
                          </label>
                          <input
                            type="text"
                            value={product.remarks}
                            onChange={(e) => updateProduct(index, 'remarks', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Any special requirements"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Attach Drawings/Documents
                    </label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 font-medium">Click to upload files</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                    </div>
                    <input ref={fileInputRef} type="file" multiple className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setShowNewInquiry(false)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitInquiry}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!newInquiry.projectName || !newInquiry.products.some(p => p.type && p.quantity)}
                    >
                      <Send className="h-4 w-4" />
                      <span>Submit Inquiry</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Inquiries List */}
            <div className="space-y-4">
              {inquiries.map(inquiry => (
                <div key={inquiry.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{inquiry.projectName}</h3>
                      <p className="text-sm text-gray-600">ID: {inquiry.id} • {inquiry.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {inquiry.products.map((product, idx) => (
                      <div key={idx} className="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-gray-700 font-medium">{product.type}</span>
                        <span className="text-gray-600">{product.quantity} {product.unit}</span>
                      </div>
                    ))}
                  </div>

                  {inquiry.status === 'Quoted' && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium text-gray-900">Total Amount:</span>
                        <span className="text-2xl font-bold text-blue-600">${inquiry.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex space-x-3">
                        <button className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                          Confirm Quote
                        </button>
                        <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                          Request Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">My Orders</h2>
            
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{order.projectName}</h3>
                      <p className="text-sm text-gray-600">Order: {order.id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-900">${order.totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Paid Amount</p>
                      <p className="text-2xl font-bold text-green-600">${order.paidAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Delivery Date</p>
                      <p className="text-lg font-semibold text-gray-900">{order.deliveryDate}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Payment Status:</span>
                      <span className="font-medium text-green-600 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {order.paidAmount >= order.totalAmount ? 'Fully Paid' : 'Pending Payment'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Commissions Tab */}
        {activeTab === 'commissions' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">My Commissions</h2>

            {/* Commission Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-10 w-10 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-600">Total Earned</p>
                    <p className="text-3xl font-bold text-green-900">${totalCommissions.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-10 w-10 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-yellow-600">Pending</p>
                    <p className="text-3xl font-bold text-yellow-900">${pendingCommissions.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Commission History */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Commission History</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {orders.map(order => (
                  <div key={order.id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">{order.projectName}</p>
                        <p className="text-sm text-gray-600 mt-1">{order.id} • Order Total: ${order.totalAmount.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-xl">${order.commission.toLocaleString()}</p>
                        <div className="flex items-center justify-end mt-1">
                          {order.commissionPaid ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-sm text-green-600 font-medium">Paid</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="text-sm text-yellow-600 font-medium">Pending</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
