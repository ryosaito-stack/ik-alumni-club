import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import {
  getSchedule,
  getSchedules,
  getPublishedSchedules,
  getCurrentMonthSchedules,
  getMonthSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '@/lib/firestore/schedules';
import { Schedule, ScheduleFormData, ScheduleQueryOptions } from '@/types';

// 単一のScheduleを取得するフック
export const useSchedule = (id: string) => {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const data = await getSchedule(id);
        setSchedule(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch schedule'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSchedule();
    }
  }, [id]);

  return { schedule, loading, error };
};

// Scheduleのリストを取得するフック
export const useSchedules = (options: ScheduleQueryOptions = {}) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const data = await getSchedules(options);
        setSchedules(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch schedules'));
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [JSON.stringify(options)]);

  return { schedules, loading, error };
};

// 公開済みScheduleを取得するフック
export const usePublishedSchedules = (options: ScheduleQueryOptions = {}) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const data = await getPublishedSchedules(options);
        setSchedules(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch schedules'));
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [JSON.stringify(options)]);

  return { schedules, loading, error };
};

// 今月のScheduleを取得するフック
export const useCurrentMonthSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const data = await getCurrentMonthSchedules();
        setSchedules(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch schedules'));
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  return { schedules, loading, error };
};

// 指定月のScheduleを取得するフック
export const useMonthSchedules = (year: number, month: number) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const data = await getMonthSchedules(year, month);
        setSchedules(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch schedules'));
      } finally {
        setLoading(false);
      }
    };

    if (year && month) {
      fetchSchedules();
    }
  }, [year, month]);

  return { schedules, loading, error };
};

// Schedule CRUD操作用フック
export const useScheduleMutations = () => {
  const { user, member } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createScheduleHandler = async (data: ScheduleFormData): Promise<string | null> => {
    if (!user || !member) {
      setError(new Error('User not authenticated'));
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const author = {
        id: user.uid,
        name: `${member.lastName} ${member.firstName}` || 'Unknown',
        role: member.role || 'member',
      };
      const id = await createSchedule(data, author);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create schedule'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateScheduleHandler = async (id: string, data: ScheduleFormData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await updateSchedule(id, data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update schedule'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteScheduleHandler = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await deleteSchedule(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete schedule'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSchedule: createScheduleHandler,
    updateSchedule: updateScheduleHandler,
    deleteSchedule: deleteScheduleHandler,
    loading,
    error,
  };
};