// Utility functions to map backend models to frontend-expected formats

/**
 * Map backend certification to frontend format
 */
const mapCertificationToFrontend = (cert) => {
    if (!cert) return null;

    return {
        _id: cert._id,
        batchId: cert.batchId,
        farmer: cert.farmer,
        cropType: cert.cropType,
        quantity: cert.quantity,
        harvestDate: cert.harvestDate,
        averageRiskScore: cert.averageRiskScore,
        // Map status: CERTIFIED/PENDING -> valid, REJECTED -> revoked
        status: (cert.status === 'REJECTED') ? 'revoked' : 'valid',
        verificationUrl: cert.verificationUrl,
        blockchainTxHash: cert.blockchainTxHash,
        createdAt: cert.certificationDate || cert.createdAt || new Date().toISOString(),
        qrCode: cert.qrCode,
    };
};

/**
 * Map backend alert to frontend format
 */
const mapAlertToFrontend = (alert) => {
    if (!alert) return null;

    return {
        _id: alert._id,
        farmer: alert.farmer,
        prediction: alert.prediction,
        // Map type: RISK_THRESHOLD -> risk_warning, etc.
        type: alert.type ? alert.type.toLowerCase().replace('_', '_') : 'info',
        // Map severity to lowercase
        severity: alert.severity ? alert.severity.toLowerCase() : 'low',
        title: alert.title,
        message: alert.message,
        // Map read/acknowledged to isRead/isAcknowledged
        isRead: alert.read || false,
        isAcknowledged: alert.acknowledged || false,
        createdAt: alert.createdAt,
    };
};

/**
 * Map backend prediction to frontend format
 */
const mapPredictionToFrontend = (prediction) => {
    if (!prediction) return null;

    return {
        _id: prediction._id,
        farmer: prediction.farmer,
        location: prediction.location,
        riskScore: prediction.riskScore,
        riskLevel: prediction.riskLevel,
        confidence: prediction.confidence,
        recommendations: prediction.recommendations || [],
        storageType: prediction.storageType,
        storageQuality: prediction.storageQuality,
        moistureContent: prediction.moistureContent,
        createdAt: prediction.createdAt,
    };
};

/**
 * Map alert stats to frontend format
 */
const mapAlertStatsToFrontend = (alerts) => {
    if (!alerts || !Array.isArray(alerts)) {
        return {
            total: 0,
            unread: 0,
            bySeverity: { low: 0, medium: 0, high: 0, critical: 0 }
        };
    }

    const total = alerts.length;
    const unread = alerts.filter(a => !a.read).length;
    const bySeverity = {
        low: alerts.filter(a => a.severity === 'LOW').length,
        medium: alerts.filter(a => a.severity === 'MODERATE').length,
        high: alerts.filter(a => a.severity === 'HIGH').length,
        critical: alerts.filter(a => a.severity === 'CRITICAL').length,
    };

    return { total, unread, bySeverity };
};

module.exports = {
    mapCertificationToFrontend,
    mapAlertToFrontend,
    mapPredictionToFrontend,
    mapAlertStatsToFrontend,
};
