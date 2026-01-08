import { LightningElement } from 'lwc';

export default class ExpenseModal extends LightningElement {

    // ================= PRIVATE HELPERS =================
    closeModal(detail = {}) {
        this.dispatchEvent(
            new CustomEvent('close', {detail})
        );
    }

    // ================= EVENT HANDLERS ================= 
    handleClose() {
        this.closeModal();
    }

    handleSuccess(event) {
        this.closeModal({
            recordId: event.detail.id
        });
    }
}