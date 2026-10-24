const STATUS = {
    draft: { label: 'Черновик', tone: 'neutral' },
    awaiting_confirm: { label: 'Ждёт подтверждения', tone: 'warn' },
    confirmed: { label: 'Подтверждён', tone: 'brand' },
    // Ждёт поступления: групповая заявка больше порога, инвентарь
    // придержан не автоматом, а решением проката.
    awaiting_stock: { label: 'Ждёт наличия', tone: 'warn' },
    issued: { label: 'Выдан', tone: 'ok' },
    partially_returned: { label: 'Частично возвращён', tone: 'warn' },
    returned: { label: 'Возвращён', tone: 'neutral' },
    overdue: { label: 'Просрочен', tone: 'danger' },
    cancelled: { label: 'Отменён', tone: 'neutral' },
    expired: { label: 'Истёк', tone: 'neutral' },
    no_show: { label: 'Не пришёл', tone: 'danger' },
};
export function statusLabel(status) {
    return STATUS[status]?.label ?? status;
}
export function statusTone(status) {
    return STATUS[status]?.tone ?? 'neutral';
}
/** Статусы, при которых заказ ещё держит инвентарь — для фильтров. */
export const ACTIVE_STATUSES = [
    'awaiting_confirm', 'confirmed', 'awaiting_stock', 'issued',
    'partially_returned', 'overdue',
];
/**
 * Человеческие названия событий хронологии заказа.
 *
 * ⚠️ Неизвестный вид события показывается КАК ЕСТЬ, а не прячется:
 * хронология — это доказательство того, что произошло, и молча
 * выброшенная строка превращает её в редактированную версию событий.
 * Новый вид события появится раньше, чем его перевод, и это нормально.
 */
const EVENT_LABELS = {
    'order.created': 'Заказ создан',
    'order.confirmed': 'Подтверждён клиентом',
    'order.cancelled': 'Отменён',
    'order.expired': 'Истёк срок подтверждения',
    'order.issued': 'Выдан на стойке',
    'order.returned': 'Возвращён',
    'order.partially_returned': 'Возвращён частично',
    'order.overdue': 'Признан просроченным',
    'order.extended': 'Продлён',
    'order.updated': 'Заказ изменён',
    'order.walk_in': 'Выдан без брони',
    'order.upsold': 'Допродажа на стойке',
    'order.no_show': 'Клиент не пришёл',
    'order.transferred': 'Переоформлен на другого человека',
    'order.awaiting_stock': 'Отложен до наличия',
    'agreement.signed': 'Договор подписан',
    'din.recorded': 'Записан фактический DIN',
    'price.overridden': 'Цена изменена вручную',
    'limit.overridden': 'Лимит снят вручную',
    'noshow.cleared': 'Снята отметка о неявке',
    'inventory.adjusted': 'Правка остатка',
    'privacy.subject_deleted': 'Данные клиента удалены по требованию',
};
export function eventLabel(kind) {
    return EVENT_LABELS[kind] ?? kind;
}
/** Кто совершил действие — для хронологии. */
export function actorLabel(actorType, actorName) {
    if (actorName)
        return actorName;
    if (actorType === 'customer')
        return 'Клиент';
    if (actorType === 'system')
        return 'Система';
    if (actorType === 'staff')
        return 'Сотрудник';
    return 'Неизвестно';
}
