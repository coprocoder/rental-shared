/**
 * Человеческие названия и тон статусов заказа.
 *
 * ⚠️ Общий пакет, потому что нужно на трёх витринах сразу и в выгрузке:
 * клиенту в его заказе, стойке, админке и в CSV сервера. Копия в каждой разошлась бы с
 * остальными на первой же правке — а расхождение здесь означает, что
 * сотрудник и клиент видят одно состояние под разными названиями и
 * спорят по телефону.
 *
 * ⚠️ Тон подбирается по смыслу для СОТРУДНИКА: «просрочен» красный не
 * потому, что клиент плохой, а потому что вещь не вернулась и её нельзя
 * выдать следующему.
 */
type OrderTone = 'neutral' | 'brand' | 'ok' | 'warn' | 'danger';
export declare function statusLabel(status: string): string;
export declare function statusTone(status: string): OrderTone;
/** Статусы, при которых заказ ещё держит инвентарь — для фильтров. */
export declare const ACTIVE_STATUSES: string[];
export declare function eventLabel(kind: string): string;
/** Кто совершил действие — для хронологии. */
export declare function actorLabel(actorType: string | null, actorName: string | null): string;
export {};
