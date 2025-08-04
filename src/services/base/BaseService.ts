import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { handleError } from "@/lib/errorHandling";

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export abstract class BaseService {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  protected async executeQuery<T>(
    operation: string,
    queryFn: () => Promise<any>
  ): Promise<ServiceResult<T>> {
    try {
      logger.debug(`Starting ${operation}`, { table: this.tableName });
      
      const startTime = performance.now();
      const result = await queryFn();
      const duration = performance.now() - startTime;
      
      if (result.error) {
        logger.error(`${operation} failed`, result.error, { 
          table: this.tableName,
          duration 
        });
        return { 
          success: false, 
          error: result.error.message || `${operation} failed` 
        };
      }

      logger.info(`${operation} completed successfully`, { 
        table: this.tableName,
        duration,
        recordCount: Array.isArray(result.data) ? result.data.length : 1
      });

      return { 
        success: true, 
        data: result.data 
      };

    } catch (error: any) {
      logger.error(`Unexpected error in ${operation}`, error, { 
        table: this.tableName 
      });
      return { 
        success: false, 
        error: error.message || `${operation} failed` 
      };
    }
  }

  async findById<T>(id: string, selectFields?: string): Promise<ServiceResult<T>> {
    return this.executeQuery<T>(`findById(${id})`, async () => {
      return await supabase
        .from(this.tableName)
        .select(selectFields || '*')
        .eq('id', id)
        .single();
    });
  }

  async findMany<T>(options: QueryOptions = {}): Promise<ServiceResult<T[]>> {
    return this.executeQuery<T[]>('findMany', async () => {
      let query = supabase.from(this.tableName).select('*');

      // Apply filters
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy, { 
          ascending: options.orderDirection === 'asc' 
        });
      }

      // Apply pagination
      if (options.page && options.limit) {
        const start = (options.page - 1) * options.limit;
        const end = start + options.limit - 1;
        query = query.range(start, end);
      }

      return await query;
    });
  }

  async create<T>(data: any): Promise<ServiceResult<T>> {
    return this.executeQuery<T>('create', async () => {
      return await supabase
        .from(this.tableName)
        .insert(data)
        .select()
        .single();
    });
  }

  async update<T>(id: string, data: any): Promise<ServiceResult<T>> {
    return this.executeQuery<T>(`update(${id})`, async () => {
      return await supabase
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();
    });
  }

  async delete(id: string): Promise<ServiceResult<void>> {
    return this.executeQuery<void>(`delete(${id})`, async () => {
      return await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);
    });
  }

  protected async executeRPC<T>(
    functionName: string,
    params: any = {}
  ): Promise<ServiceResult<T>> {
    return this.executeQuery<T>(`RPC(${functionName})`, async () => {
      return await supabase.rpc(functionName, params);
    });
  }

  protected buildSelectClause(fields: string[]): string {
    return fields.join(', ');
  }

  protected async exists(id: string): Promise<boolean> {
    const result = await this.executeQuery('exists', async () => {
      return await supabase
        .from(this.tableName)
        .select('id')
        .eq('id', id)
        .maybeSingle();
    });

    return result.success && !!result.data;
  }
}