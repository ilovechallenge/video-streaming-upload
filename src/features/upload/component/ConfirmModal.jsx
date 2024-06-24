import React from "react";
import { Button, Modal } from "react-bootstrap";

import "./ConfirmModal.scss";

export const ConfirmModal = ({
  showModal,
  onClose,
  onSave,
  selectedRowCnt,
}) => {
  return (
    <Modal
      show={showModal}
      onHide={onClose}
      dialogClassName="modal-stamp"
      size="lg"
      centered
    >
      <Modal.Header>
        <span
          className="confirm-modal-header"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          選択した{selectedRowCnt}件を本当に削除してよろしいですか？
        </span>
      </Modal.Header>
      <Modal.Footer>
        <div className="confirm-modal-footer">
          <Button onClick={onClose}>いいえ</Button>
          <Button onClick={onSave}>はい</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
