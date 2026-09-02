/**
 * Health & Readiness Service for Container Orchestration (Kubernetes / Cloud Run / Docker)
 */

import * as fs from 'fs';
import * as path from 'path';

export interface HealthStatus {
  status: 'UP' | 'DOWN' | 'DEGRADED';
  timestamp: string;
  uptimeSeconds: number;
  checks: {
    systemMemory: {
      status: 'UP' | 'WARN';
      heapUsedMB: number;
      heapTotalMB: number;
      rssMB: number;
    };
    storageWritable: {
      status: 'UP' | 'DOWN';
      path: string;
      error?: string;
    };
    conversationEngine: {
      status: 'UP' | 'DOWN';
      ready: boolean;
    };
    telegramAuth: {
      status: 'CONNECTED' | 'DISCONNECTED';
      phoneNumber?: string;
    };
  };
}

export class HealthService {
  private static startTime = Date.now();
  private static isShuttingDown = false;

  public static markShuttingDown() {
    this.isShuttingDown = true;
  }

  public static getLiveness(): { status: 'UP' | 'DOWN'; code: number } {
    if (this.isShuttingDown) {
      return { status: 'DOWN', code: 503 };
    }
    return { status: 'UP', code: 200 };
  }

  public static getReadiness(dataPath: string = path.join(process.cwd(), 'telegram_promoter_data.json')): {
    ready: boolean;
    code: number;
    reason?: string;
  } {
    if (this.isShuttingDown) {
      return { ready: false, code: 503, reason: 'Service is shutting down' };
    }

    try {
      // Check if data directory is writable
      const testFile = path.join(path.dirname(dataPath), `.health_write_test_${Date.now()}`);
      fs.writeFileSync(testFile, 'ok', 'utf-8');
      fs.unlinkSync(testFile);
      return { ready: true, code: 200 };
    } catch (err: any) {
      return { ready: false, code: 500, reason: `Storage not writable: ${err.message}` };
    }
  }

  public static getDetailedHealth(
    isTelegramConnected: boolean = false,
    phoneNumber?: string,
    dataPath: string = path.join(process.cwd(), 'telegram_promoter_data.json')
  ): HealthStatus {
    const mem = process.memoryUsage();
    const heapUsedMB = Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100;
    const heapTotalMB = Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100;
    const rssMB = Math.round((mem.rss / 1024 / 1024) * 100) / 100;

    let storageStatus: 'UP' | 'DOWN' = 'UP';
    let storageError: string | undefined;

    try {
      const dir = path.dirname(dataPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const testFile = path.join(dir, `.health_check_${Date.now()}`);
      fs.writeFileSync(testFile, 'ok', 'utf-8');
      fs.unlinkSync(testFile);
    } catch (e: any) {
      storageStatus = 'DOWN';
      storageError = e.message;
    }

    const memoryHealthy = heapUsedMB < 1024; // Less than 1GB heap
    const isEngineUp = true;

    let overallStatus: 'UP' | 'DOWN' | 'DEGRADED' = 'UP';
    if (this.isShuttingDown || storageStatus === 'DOWN') {
      overallStatus = 'DOWN';
    } else if (!memoryHealthy) {
      overallStatus = 'DEGRADED';
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      checks: {
        systemMemory: {
          status: memoryHealthy ? 'UP' : 'WARN',
          heapUsedMB,
          heapTotalMB,
          rssMB,
        },
        storageWritable: {
          status: storageStatus,
          path: dataPath,
          error: storageError,
        },
        conversationEngine: {
          status: isEngineUp ? 'UP' : 'DOWN',
          ready: isEngineUp,
        },
        telegramAuth: {
          status: isTelegramConnected ? 'CONNECTED' : 'DISCONNECTED',
          phoneNumber,
        },
      },
    };
  }
}
