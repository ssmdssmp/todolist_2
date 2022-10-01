// import { useState } from "react";
// import { useRef, useEffect } from "react";
// import deleteImg from "../img/delete.svg";
// import folderImg from "../img/folder.svg";
// import folderActive from "../img/folder-active.svg";
// const Folders = () => {
//   const [folders, setFolders] = useState(
//     JSON.parse(localStorage.getItem("folders")) || []
//   );

//   const [openFolders, setOpenFolders] = useState();
//   const foldersRef = useRef();
//   function useOutsideAlerter(ref) {
//     useEffect(() => {
//       function handleClickOutside(event) {
//         if (ref.current && !ref.current.contains(event.target)) {
//           if (
//             event.target === document.querySelector(".folders-button") ||
//             event.target ===
//               document.querySelector(".menu ul li:nth-child(4) p")
//           ) {
//             return;
//           } else {
//             setOpenFolders(false);
//           }
//         }
//       }
//       document.addEventListener("mousedown", handleClickOutside);
//       return () => {
//         document.removeEventListener("mousedown", handleClickOutside);
//       };
//     }, [ref]);
//   }
//   useOutsideAlerter(foldersRef);

//   return (
//     <div
//       ref={foldersRef}
//       className="folders"
//       style={{ visibility: openFolders ? "visible" : "hidden" }}
//     >
//       <div className="folders-content">
//         <div className="choose-folder">
//           <img src={folderImg} alt="folder-img" />
//           <p>Choose folder</p>
//         </div>
//         <hr />

//         <ul className="folders-list">
//           <li onClick={() => setFolderFilter(false)}>
//             <img src={!folderFilter ? folderActive : folderImg} alt="" /> All
//             Tasks
//           </li>
//           {folders.map((item) => {
//             return (
//               <li key={uuid()}>
//                 <img
//                   onClick={() => handleFoldersList(item.title)}
//                   src={
//                     folderFilter &&
//                     folderList.length !== 0 &&
//                     folderList[0].folder === item.title
//                       ? folderActive
//                       : folderImg
//                   }
//                   alt="folder-img"
//                 />
//                 <p onClick={() => handleFoldersList(item.title)}>
//                   {item.title}
//                 </p>
//                 <img
//                   onClick={(e) => handleDeleteFolder(e)}
//                   src={deleteImg}
//                   alt=""
//                 />
//               </li>
//             );
//           })}

//           <div className="create-folder">
//             <img
//               onClick={() => createFolder(addFolderInput)}
//               src={folderPlus}
//               alt="folder-img"
//             />
//             <input
//               onKeyDown={(e) => createFolder__keyboard(e)}
//               value={addFolderInput}
//               onChange={(e) => setFolderInput(e.target.value)}
//               type="text"
//               placeholder="Create Folder"
//             />
//           </div>
//         </ul>
//         <hr />
//       </div>
//     </div>
//   );
// };
// export default Folders;
