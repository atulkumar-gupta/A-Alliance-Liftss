import app from './firebase'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore'

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage'

const db = getFirestore(app)
export const storage = getStorage(app)

const collections = {
  spareparts: 'spareparts',
  sparepartsImages: 'spareparts_images',
  announcements: 'announcements',
  announcementsImages: 'announcements_images',
  contactMessages: 'contact_messages',
  orders: 'orders',
  profiles: 'profiles',
  projects: 'projects',
  ongoingProjects: 'ongoingProjects',
  completedProjects: 'completedProjects'
}

export async function getAll(collectionName, orderField = null) {
  const col = collection(db, collections[collectionName])
  let q = col
  if (orderField) {
    q = query(col, orderBy(orderField, 'desc'))
  }
  const snapshot = await getDocs(q)
  return snapshot.docs.map(document => ({ id: document.id, ...document.data() }))
}

export async function getById(collectionName, id) {
  const documentRef = doc(db, collections[collectionName], id)
  const snap = await getDoc(documentRef)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function insert(collectionName, data) {
  const col = collection(db, collections[collectionName])
  const documentRef = await addDoc(col, {
    ...data,
    created_at: serverTimestamp()
  })
  return { id: documentRef.id, ...data }
}

export async function update(collectionName, id, data) {
  const documentRef = doc(db, collections[collectionName], id)
  await updateDoc(documentRef, {
    ...data,
    updated_at: serverTimestamp()
  })
  return { id, ...data }
}

export async function remove(collectionName, id) {
  try {
    const documentRef = doc(db, collections[collectionName], id)
    await deleteDoc(documentRef)
    return true
  } catch (error) {
    console.error(`Error removing document from ${collectionName}:`, error)
    return false
  }
}

export async function uploadFile(path, file) {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)
  return url
}

export async function deleteFile(path) {
  const storageReference = ref(storage, path)
  await deleteObject(storageReference)
}

export async function getFiles(path) {
  const storageReference = ref(storage, path)
  const result = await listAll(storageReference)
  const items = []
  for (const itemReference of result.items) {
    items.push({
      path: itemReference.fullPath,
      url: await getDownloadURL(itemReference)
    })
  }
  return items
}

export async function getFileUrl(path) {
  const storageReference = ref(storage, path)
  return await getDownloadURL(storageReference)
}

export async function getAllSpareParts() {
  try {
    const snaps = await getDocs(collection(db, 'spareparts'))
    const data = snaps.docs.map(document => ({ id: document.id, ...document.data() }))
    return mergeSpareParts(data)
  } catch (error) {
    console.error('Error loading spare parts from Firestore:', error)
    return getLocalSpareParts()
  }
}

export async function getSparePartById(id) {
  const snap = await getDoc(doc(db, 'spareparts', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function saveSparePart(part) {
  const id = part.id || Date.now().toString()
  const saved = upsertLocalSparePart({ ...part, id })
  setDoc(doc(db, 'spareparts', id), { ...part, id }, { merge: true }).catch(error => {
    console.error('Error saving spare part to Firestore:', error)
  })
  return saved
}

export async function deleteSparePart(id) {
  removeLocalSparePart(id)
  deleteDoc(doc(db, 'spareparts', id)).catch(error => {
    console.error('Error deleting spare part from Firestore:', error)
  })
}

const sparepartsImagesRef = 'spareparts-images'
const LOCAL_SPARE_PARTS_KEY = 'local_spareparts'

function getLocalSpareParts() {
  try {
    const raw = localStorage.getItem(LOCAL_SPARE_PARTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setLocalSpareParts(items) {
  try {
    localStorage.setItem(LOCAL_SPARE_PARTS_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to cache spare parts locally:', error)
  }
}

function upsertLocalSparePart(part) {
  const current = getLocalSpareParts()
  const saved = { ...part, updatedAt: new Date().toISOString() }
  const index = current.findIndex(item => String(item.id) === String(saved.id))
  if (index >= 0) {
    current[index] = saved
  } else {
    current.push(saved)
  }
  setLocalSpareParts(current)
  return saved
}

function removeLocalSparePart(id) {
  const current = getLocalSpareParts()
  setLocalSpareParts(current.filter(item => String(item.id) !== String(id)))
}

function mergeSpareParts(firestoreData) {
  const localData = getLocalSpareParts()
  const byId = new Map(firestoreData.map(item => [String(item.id), item]))
  localData.forEach(item => byId.set(String(item.id), item))
  return Array.from(byId.values())
}

export async function uploadSparePartImage(file, fileName) {
  const path = `${sparepartsImagesRef}/${fileName}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return await getDownloadURL(storageRef)
}

export async function deleteSparePartImage(path) {
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}

export async function getSparePartImages() {
  const storageReference = ref(storage, sparepartsImagesRef)
  const result = await listAll(storageReference)
  const items = []
  for (const itemReference of result.items) {
    items.push({
      path: itemReference.fullPath,
      url: await getDownloadURL(itemReference)
    })
  }
  return items
}

export async function getAllAnnouncements() {
  const snaps = await getDocs(
    query(collection(db, 'announcements'), orderBy('created_at', 'desc'))
  )
  return snaps.docs.map(document => ({ id: document.id, ...document.data() }))
}


export async function getAnnouncementById(id) {
  const snap = await getDoc(doc(db, 'announcements', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function saveAnnouncement(ann) {
  const documentRef = doc(db, 'announcements', ann.id || Date.now().toString())
  await setDoc(documentRef, ann, { merge: true })
  return { ...ann, id: documentRef.id }
}

export async function deleteAnnouncement(id) {
  await deleteDoc(doc(db, 'announcements', id))
}

export async function replaceAllAnnouncements(items) {
  const existing = await getAllAnnouncements()
  const batch = []
  for (const d of existing) {
    batch.push(deleteDoc(doc(db, 'announcements', d.id)))
  }
  await Promise.all(batch)
  const writes = []
  for (const item of items) {
    const documentRef = doc(db, 'announcements', item.id || Date.now().toString())
    writes.push(setDoc(documentRef, { ...item, created_at: serverTimestamp() }, { merge: true }))
  }
  await Promise.all(writes)
  return items
}

const announcementsImagesRef = 'announcements-images'

export async function uploadAnnouncementImage(file, fileName) {
  const path = `${announcementsImagesRef}/${fileName}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return await getDownloadURL(storageRef)
}

export async function deleteAnnouncementImage(path) {
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}

export async function getAnnouncementImages() {
  const storageReference = ref(storage, announcementsImagesRef)
  const result = await listAll(storageReference)
  const items = []
  for (const itemReference of result.items) {
    items.push({
      path: itemReference.fullPath,
      url: await getDownloadURL(itemReference)
    })
  }
  return items
}

const projectsImagesRef = 'projects-images'
const localProjectKeys = {
  projects: 'local_projects',
  ongoingProjects: 'local_ongoing_projects'
}

function getLocalProjects(collectionName) {
  try {
    const raw = localStorage.getItem(localProjectKeys[collectionName])
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setLocalProjects(collectionName, items) {
  try {
    localStorage.setItem(localProjectKeys[collectionName], JSON.stringify(items))
  } catch (error) {
    console.error(`Failed to cache ${collectionName} locally:`, error)
  }
}

function upsertLocalProject(collectionName, project) {
  const current = getLocalProjects(collectionName)
  const saved = { ...project, updatedAt: new Date().toISOString() }
  const index = current.findIndex(item => String(item.id) === String(saved.id))
  if (index >= 0) {
    current[index] = saved
  } else {
    current.push(saved)
  }
  setLocalProjects(collectionName, current)
  return saved
}

function removeLocalProject(collectionName, id) {
  const current = getLocalProjects(collectionName)
  const filtered = current.filter(item => String(item.id) !== String(id))
  setLocalProjects(collectionName, filtered)
}

function mergeProjectData(collectionName, firestoreData) {
  const localData = getLocalProjects(collectionName)
  if (!localData.length) return firestoreData
  const byId = new Map(firestoreData.map(item => [String(item.id), item]))
  localData.forEach(item => byId.set(String(item.id), item))
  return Array.from(byId.values())
}

function projectImageToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export async function uploadProjectImage(file, fileName) {
  const path = `${projectsImagesRef}/${fileName}`
  const storageRef = ref(storage, path)
  try {
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef)
  } catch {
    return await projectImageToDataUrl(file)
  }
}

export async function getProjectImages() {
  const storageReference = ref(storage, projectsImagesRef)
  const result = await listAll(storageReference)
  const items = []
  for (const itemReference of result.items) {
    items.push({
      path: itemReference.fullPath,
      url: await getDownloadURL(itemReference)
    })
  }
  return items
}

export async function getAllProjects() {
  try {
    const snaps = await getDocs(collection(db, 'projects'))
    const data = snaps.docs.map(document => ({ id: document.id, ...document.data() }))
    return mergeProjectData('projects', data)
  } catch (error) {
    console.error('Error loading projects from Firestore:', error)
    return getLocalProjects('projects')
  }
}

export async function getProjectById(id) {
  const snap = await getDoc(doc(db, 'projects', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function saveProject(project) {
  const id = project.id || Date.now().toString()
  const saved = upsertLocalProject('projects', { ...project, id })
  setDoc(doc(db, 'projects', id), { ...project, id }, { merge: true }).catch(error => {
    console.error('Error saving project to Firestore:', error)
  })
  return saved
}

export async function deleteProject(id) {
  removeLocalProject('projects', id)
  deleteDoc(doc(db, 'projects', id)).catch(error => {
    console.error('Error deleting project from Firestore:', error)
  })
}

export async function getAllOngoingProjects() {
  try {
    const snaps = await getDocs(collection(db, 'ongoingProjects'))
    const data = snaps.docs.map(document => ({ id: document.id, ...document.data() }))
    return mergeProjectData('ongoingProjects', data)
  } catch (error) {
    console.error('Error loading ongoing projects from Firestore:', error)
    return getLocalProjects('ongoingProjects')
  }
}

export async function saveOngoingProject(project) {
  const id = project.id || Date.now().toString()
  const saved = upsertLocalProject('ongoingProjects', { ...project, id })
  setDoc(doc(db, 'ongoingProjects', id), { ...project, id }, { merge: true }).catch(error => {
    console.error('Error saving ongoing project to Firestore:', error)
  })
  return saved
}

export async function deleteOngoingProject(id) {
  removeLocalProject('ongoingProjects', id)
  deleteDoc(doc(db, 'ongoingProjects', id)).catch(error => {
    console.error('Error deleting ongoing project from Firestore:', error)
  })
}

export async function getAllCompletedProjects() {
  const snaps = await getDocs(query(collection(db, 'completedProjects'), orderBy('completedAt', 'desc')))
  return snaps.docs.map(document => ({ id: document.id, ...document.data() }))
}

export async function saveCompletedProject(project) {
  const documentRef = doc(db, 'completedProjects', project.id || Date.now().toString())
  await setDoc(documentRef, { ...project, completedAt: serverTimestamp() }, { merge: true })
  return { ...project, id: documentRef.id }
}

export async function deleteCompletedProject(id) {
  await deleteDoc(doc(db, 'completedProjects', id))
}
