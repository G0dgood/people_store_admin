import { ApiResponse } from '@/lib/types/api';
import { baseApi } from '../baseApi';

export interface Driver {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
  vehicleType: 'Bicycle' | 'Motorcycle' | 'Car' | 'Van';
  vehicleNumber: string;
  isAvailable: boolean;
  status: 'active' | 'deactivated';
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
}

export const driverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDrivers: builder.query<ApiResponse<{ drivers: Driver[], pagination: any }>, { page?: number; limit?: number; search?: string; status?: string; isAvailable?: string } | void>({
      query: (params) => ({
        url: '/drivers',
        method: 'GET',
        params: params || {},
      }),
      providesTags: ['Driver'],
    }),
    toggleDriverStatus: builder.mutation<ApiResponse<Driver>, { driverId: string; status: 'active' | 'deactivated' }>({
      query: ({ driverId, status }) => ({
        url: `/drivers/${driverId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Driver'],
    }),
    deleteDriver: builder.mutation<ApiResponse<any>, string>({
      query: (driverId) => ({
        url: `/drivers/${driverId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Driver'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllDriversQuery,
  useToggleDriverStatusMutation,
  useDeleteDriverMutation,
} = driverApi;
