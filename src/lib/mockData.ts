// Mock data for demo mode
export interface SocketData {
  socket_id: string;
  student: string;
  voltage: string;
  current: string;
  temperature: string;
  status: 'ON' | 'OFF';
  power: string;
}

export const mockSockets: Record<string, SocketData> = {
  S1: {
    socket_id: 'S1',
    student: '4NI23EC065',
    voltage: '230V',
    current: '0.35A',
    temperature: '27°C',
    status: 'ON',
    power: '80W'
  },
  S2: {
    socket_id: 'S2',
    student: '4NI23EC066',
    voltage: '228V',
    current: '0.42A',
    temperature: '29°C',
    status: 'ON',
    power: '96W'
  },
  S3: {
    socket_id: 'S3',
    student: '4NI23EC067',
    voltage: '0V',
    current: '0A',
    temperature: '24°C',
    status: 'OFF',
    power: '0W'
  },
  S4: {
    socket_id: 'S4',
    student: '4NI23EC068',
    voltage: '231V',
    current: '0.28A',
    temperature: '26°C',
    status: 'ON',
    power: '65W'
  },
  S5: {
    socket_id: 'S5',
    student: '',
    voltage: '0V',
    current: '0A',
    temperature: '23°C',
    status: 'OFF',
    power: '0W'
  },
  S6: {
    socket_id: 'S6',
    student: '',
    voltage: '0V',
    current: '0A',
    temperature: '23°C',
    status: 'OFF',
    power: '0W'
  }
};

// Simulate real-time updates
export const getSocketData = (socketId: string): SocketData => {
  return mockSockets[socketId] || {
    socket_id: socketId,
    student: '',
    voltage: '0V',
    current: '0A',
    temperature: '0°C',
    status: 'OFF',
    power: '0W'
  };
};

export const getAllSockets = (): SocketData[] => {
  return Object.values(mockSockets);
};

export const updateSocketStatus = (socketId: string, status: 'ON' | 'OFF') => {
  if (mockSockets[socketId]) {
    mockSockets[socketId].status = status;
    
    if (status === 'ON') {
      mockSockets[socketId].voltage = '230V';
      mockSockets[socketId].current = `${(Math.random() * 0.5 + 0.2).toFixed(2)}A`;
      mockSockets[socketId].temperature = `${Math.floor(Math.random() * 5 + 25)}°C`;
      mockSockets[socketId].power = `${Math.floor(Math.random() * 50 + 50)}W`;
    } else {
      mockSockets[socketId].voltage = '0V';
      mockSockets[socketId].current = '0A';
      mockSockets[socketId].power = '0W';
    }
  }
};
