import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import useAppStore from '../stores/useAppStore';

const WithdrawModal = ({ isOpen, onClose }) => {
  const {
    userTokens,
    getWithdrawableAmount,
    canWithdraw,
    processWithdrawal,
    getWithdrawHistory,
    COIN_VALUE,
    MIN_WITHDRAWAL
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('withdraw');
  const [withdrawForm, setWithdrawForm] = useState({
    coins: '',
    paymentMethod: 'PIX',
    pixKey: '',
    bankAccount: {
      bank: '',
      agency: '',
      account: '',
      accountType: 'corrente'
    }
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const withdrawableAmount = getWithdrawableAmount();
  const withdrawHistory = getWithdrawHistory();

  const handleInputChange = (field, value) => {
    setWithdrawForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBankInputChange = (field, value) => {
    setWithdrawForm(prev => ({
      ...prev,
      bankAccount: {
        ...prev.bankAccount,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const coins = parseInt(withdrawForm.coins);
      
      if (coins < MIN_WITHDRAWAL) {
        alert(`Saque mínimo de ${MIN_WITHDRAWAL} SIGAR Coins`);
        return;
      }

      if (coins > userTokens) {
        alert('Saldo insuficiente');
        return;
      }

      const accountInfo = withdrawForm.paymentMethod === 'PIX' 
        ? { pixKey: withdrawForm.pixKey }
        : withdrawForm.bankAccount;

      processWithdrawal({
        coins,
        paymentMethod: withdrawForm.paymentMethod,
        accountInfo
      });

      alert(`Saque de ${coins} SIGAR Coins (R$ ${(coins * COIN_VALUE).toFixed(2)}) solicitado com sucesso!\nProcessamento em até 2 dias úteis.`);
      
      setWithdrawForm({
        coins: '',
        paymentMethod: 'PIX',
        pixKey: '',
        bankAccount: {
          bank: '',
          agency: '',
          account: '',
          accountType: 'corrente'
        }
      });
      setActiveTab('history');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PROCESSING': return '⏳';
      case 'COMPLETED': return '✅';
      case 'FAILED': return '❌';
      default: return '❓';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PROCESSING': return 'Processando';
      case 'COMPLETED': return 'Concluído';
      case 'FAILED': return 'Falhou';
      default: return 'Desconhecido';
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">💰 Saque de SIGAR Coins</h2>
              <p className="text-green-100 text-sm mt-1">
                Transforme suas coins em dinheiro real
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{userTokens}</div>
              <div className="text-xs text-green-100">SIGAR Coins</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">R$ {withdrawableAmount.toFixed(2)}</div>
              <div className="text-xs text-green-100">Valor Disponível</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">R$ {COIN_VALUE.toFixed(2)}</div>
              <div className="text-xs text-green-100">Por Coin</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 px-6 py-3 border-b">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'withdraw'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              💸 Sacar Coins
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 Histórico ({withdrawHistory.length})
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {activeTab === 'withdraw' && (
            <div className="space-y-6">
              {!canWithdraw() && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                  <strong>⚠️ Saque Indisponível:</strong> Você precisa de pelo menos {MIN_WITHDRAWAL} SIGAR Coins para sacar.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade de SIGAR Coins para Saque
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={MIN_WITHDRAWAL}
                      max={userTokens}
                      value={withdrawForm.coins}
                      onChange={(e) => handleInputChange('coins', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={`Mínimo ${MIN_WITHDRAWAL} coins`}
                      disabled={!canWithdraw()}
                      required
                    />
                    {withdrawForm.coins && (
                      <div className="mt-1 text-sm text-gray-600">
                        Valor a receber: <strong className="text-green-600">R$ {(withdrawForm.coins * COIN_VALUE).toFixed(2)}</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Pagamento
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleInputChange('paymentMethod', 'PIX')}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        withdrawForm.paymentMethod === 'PIX'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">PIX</div>
                      <div className="text-xs text-gray-500">Instantâneo</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('paymentMethod', 'BANK_TRANSFER')}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        withdrawForm.paymentMethod === 'BANK_TRANSFER'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">Transferência</div>
                      <div className="text-xs text-gray-500">1-2 dias úteis</div>
                    </button>
                  </div>
                </div>

                {withdrawForm.paymentMethod === 'PIX' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chave PIX
                    </label>
                    <input
                      type="text"
                      value={withdrawForm.pixKey}
                      onChange={(e) => handleInputChange('pixKey', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="CPF, e-mail, celular ou chave aleatória"
                      required
                    />
                  </div>
                )}

                {withdrawForm.paymentMethod === 'BANK_TRANSFER' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Banco
                        </label>
                        <select
                          value={withdrawForm.bankAccount.bank}
                          onChange={(e) => handleBankInputChange('bank', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        >
                          <option value="">Selecione</option>
                          <option value="001">Banco do Brasil</option>
                          <option value="104">Caixa Econômica</option>
                          <option value="341">Itaú</option>
                          <option value="237">Bradesco</option>
                          <option value="033">Santander</option>
                          <option value="260">Nu Pagamentos</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Conta
                        </label>
                        <select
                          value={withdrawForm.bankAccount.accountType}
                          onChange={(e) => handleBankInputChange('accountType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        >
                          <option value="corrente">Corrente</option>
                          <option value="poupanca">Poupança</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Agência
                        </label>
                        <input
                          type="text"
                          value={withdrawForm.bankAccount.agency}
                          onChange={(e) => handleBankInputChange('agency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="0000"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Conta
                        </label>
                        <input
                          type="text"
                          value={withdrawForm.bankAccount.account}
                          onChange={(e) => handleBankInputChange('account', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="00000-0"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <button
                    type="submit"
                    disabled={!canWithdraw() || isProcessing}
                    className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                      canWithdraw() && !isProcessing
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isProcessing ? '⏳ Processando...' : '💰 Solicitar Saque'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Histórico de Saques
                </h3>
              </div>

              {withdrawHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-4xl mb-4">💰</div>
                  <p>Nenhum saque realizado ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {withdrawHistory.map((withdrawal) => (
                    <div key={withdrawal.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">{getStatusIcon(withdrawal.status)}</span>
                            <span className="font-semibold text-gray-800">
                              {withdrawal.coins} SIGAR Coins
                            </span>
                            <span className="text-sm text-gray-500">
                              → R$ {withdrawal.amount.toFixed(2)}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            <div><strong>Método:</strong> {withdrawal.paymentMethod === 'PIX' ? 'PIX' : 'Transferência Bancária'}</div>
                            <div><strong>Solicitado:</strong> {new Date(withdrawal.requestedAt).toLocaleString('pt-BR')}</div>
                            {withdrawal.processedAt && (
                              <div><strong>Processado:</strong> {new Date(withdrawal.processedAt).toLocaleString('pt-BR')}</div>
                            )}
                          </div>
                        </div>
                        
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          withdrawal.status === 'COMPLETED' 
                            ? 'bg-green-100 text-green-800'
                            : withdrawal.status === 'PROCESSING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getStatusText(withdrawal.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WithdrawModal;
