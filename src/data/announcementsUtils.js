import { getAllAnnouncements, getAnnouncementById, saveAnnouncement, deleteAnnouncement, uploadAnnouncementImage, deleteAnnouncementImage, getAnnouncementImages, replaceAllAnnouncements } from '../lib/firebaseDB'

export async function loadAnnouncements() {
  return getAllAnnouncements()
}

export async function getAnnouncement(id) {
  return getAnnouncementById(id)
}

export async function saveAnnouncements(item) {
  return saveAnnouncement(item)
}

export async function deleteAnnouncementData(id) {
  return deleteAnnouncement(id)
}

export async function uploadAnnouncementFile(file, fileName) {
  return uploadAnnouncementImage(file, fileName)
}

export async function getAnnouncementFiles() {
  return getAnnouncementImages()
}

export async function deleteAnnouncementFile(path) {
  return deleteAnnouncementImage(path)
}

export async function saveAllAnnouncements(items) {
  return replaceAllAnnouncements(items)
}

export { uploadAnnouncementImage, deleteAnnouncementImage, getAnnouncementImages }
