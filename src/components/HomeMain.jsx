"use client"
import React, { useState } from 'react'
import CardDocument from './CardDocument'
import ModalMain from './ModalMain'
import styles from './HomeMain.module.css'

const HomeMain = () => {
  const [documentUrl, setDocumentUrl] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openDocument = (url) => {
    setDocumentUrl(url)
    setIsModalOpen(true)
  }

  const closeDocument = () => {
    setDocumentUrl('')
    setIsModalOpen(false)
  }

  return <div className={styles.container}>
  <div className={styles.cardContainer}>
      <CardDocument title="Preescolar" url="https://docs.google.com/document/d/1VlBEq8wZ-RIWKbeljX1oZsY7LjX3kITR2_VILJZzUqI/preview" onClick={openDocument}/>
      <CardDocument title="Documento 2" url="https://docs.google.com/document/d/ID_DEL_DOCUMENTO_2/preview" onClick={openDocument} />
      <CardDocument title="Documento 3" url="https://docs.google.com/document/d/ID_DEL_DOCUMENTO_3/preview" onClick={openDocument} />
  </div>

  <ModalMain show={isModalOpen} onClose={closeDocument} documentUrl={documentUrl} />
</div>
  
}

export default HomeMain
