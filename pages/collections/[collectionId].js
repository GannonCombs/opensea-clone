import React, { useEffect, useState, useMemo } from 'react'
import {useRouter} from 'next/router'
import Link from 'next/Link'
import { useWeb3 } from '@3rdweb/hooks'
// import { useWeb3 } from '@3rdweb/sdk/react'
import { client } from '../../lib/sanityClient'
import { ThirdwebSDK } from '@3rdweb/sdk'
import Header from '../../components/Header'
import { CgWebsite } from 'react-icons/cg'
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { HiDotsVertical } from 'react-icons/hi'
import NFTCard from '../../components/NFTCard'
import { ethers } from 'ethers'

const style = {
    bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
    bannerImage: `w-full object-cover`,
    infoContainer: `w-screen px-4`,
    midRow: `w-full flex justify-center text-white`,
    endRow: `w-full flex justify-end text-white`,
    profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
    socialIconsContainer: `flex text-3xl mb-[-2rem]`,
    socialIconsWrapper: `w-44`,
    socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
    socialIcon: `my-2`,
    divider: `border-r-2`,
    title: `text-5xl font-bold mb-4`,
    createdBy: `text-lg mb-4`,
    statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
    collectionStat: `w-1/4`,
    statValue: `text-3xl font-bold w-full flex items-center justify-center`,
    ethLogo: `h-6 mr-2`,
    statName: `text-lg w-full text-center mt-1`,
    description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
  }

const Collection = () => {
    const router = useRouter()
    //TODO: More broken thirdweb shit. Find a way to fix.
  const { provider } = useWeb3()
// const { ethereum } = window
//   const {provider} = new ethers.providers.Web3Provider(ethereum)
  const { collectionId } = router.query
  const [collection, setCollection] = useState({})
  const [nfts, setNfts] = useState([])
  const [listings, setListings] = useState([])

  
  const nftModule = useMemo(() => {
    console.log("In nft module. Provider = " , provider)
    if (!provider) return

    const sdk = new ThirdwebSDK(
      provider.getSigner(),
      //'https://goerli.infura.io/v3/8d7ae025205449b38566f60e110bcc1c'
    )
    return sdk.getNFTModule(collectionId)
  }, [provider])

  //TODO: Get this to return NFT images.
  // get all NFTs in the collection
  useEffect(() => {
    console.log("In nft useEffect. Nftmodule = " , nftModule)
    // if (!nftModule) return
    // ;(async () => {
    //     console.log("Getting nfts!")
    //   const nfts = await nftModule.getAll()
    //   console.log("Got nfts! Length: " , nfts.length)

    //?!
    const testNft1 = {
        "id": 69,
        "nftItem": {
            "id": 69,
            "image": "/sand.jpg",
            "name": "My First Test NFT",
            "likes": 0
        },
        "collection": {
            "title": "My Test NFT"
        },
        "listings": [
            {
                "asset": {
                    "id": 69
                }
            }
        ]
      }
      const testNft2 = {
        "id": 70,
        "nftItem": {
            "id": 70,
            "image": "/red_house.jpg",
            "name": "My second Test NFT",
            "likes": 0
        },
        "collection": {
            "title": "My Test NFT2"
        },
        "listings": [
            {
                "asset": {
                    "id": 70
                }
            }
        ]
      }
      const testNftArray = [testNft1, testNft2]
    //   setNfts(nfts)
    setNfts(testNftArray)

      
    //})()
  }, [nftModule])

  const marketPlaceModule = useMemo(() => {
    if (!provider) return

    const sdk = new ThirdwebSDK(
      provider.getSigner(),
      //'https://goerli.infura.io/v3/8d7ae025205449b38566f60e110bcc1c'
    )
    return sdk.getMarketplaceModule(
      '0xe04390675e240B1ad9cFf1C0BA1aA8970066506f'
    )
  }, [provider])

  // get all listings in the collection
  useEffect(() => {
    if (!marketPlaceModule) return
    ;(async () => {
      setListings(await marketPlaceModule.getAllListings())
    })()
  }, [marketPlaceModule])

  const fetchCollectionData = async (sanityClient = client) => {
    //console.log("collection id: " , collectionId)

    const query = `*[_type == "marketItems" && contractAddress == "${collectionId}" ] {
      "imageUrl": profileImage.asset->url,
      "bannerImageUrl": bannerImage.asset->url,
      volumeTraded,
      createdBy,
      contractAddress,
      "creator": createdBy->userName,
      title, floorPrice,
      "allOwners": owners[]->,
      description
    }`

    const collectionData = await sanityClient.fetch(query)

    console.log("RRR " , collectionData, '🔥')

    // the query returns 1 object inside of an array
    await setCollection(collectionData[0])
  }

  useEffect(() => {
    fetchCollectionData()
  }, [collectionId])

    return (
        <div className="overflow=hidden">
          <Header/>
          <div className={style.bannerImageContainer}>
            <img className={style.bannerImage}
            src={
                collection?.bannerImageUrl
                ? collection.bannerImageUrl
                : 'https://via.placeholder.com/200'
            }
            alt = "banner"
            />
        </div>  
        <div className={style.infoContainer}>
            <div className={style.midRow}>
            <img className={style.profileImg}
            src={
                collection?.imageUrl
                ? collection.imageUrl
                : 'https://via.placeholder.com/200'
            }
            alt = "profile-image"
            />
            </div>
            <div className={style.endRow}>
            <div className={style.socialIconsContainer}>
            <div className={style.socialIconsWrapper}>
            <div className={style.socialIconsContent}>
            <div className={style.socialIcon}>
                <CgWebsite />
            </div>
                <div className={style.divider}/>
                <div className={style.socialIcon}>
                    <AiOutlineInstagram />
                </div>
                <div className={style.divider}/>
                <div className={style.socialIcon}>
                    <AiOutlineTwitter />
                </div>
                <div className={style.divider}/>
                <div className={style.socialIcon}>
                    <HiDotsVertical />
                </div>
            </div>
            </div>
            </div>
            </div>
            <div className={style.midRow}>
                <div className={style.title}>
                    {collection?.title}
                </div>
            </div>
            <div className={style.midRow}>
                <div className={style.createdBy}>
                    Created by {' '}
                    <span className="text-[#2081e2]">
                    {collection?.creator}
                    </span>
                </div>
            </div>
            <div className={style.midRow}>
                <div className={style.statsContainer}>
                    <div className={style.collectionStat}>
                        <div className={style.statValue}>
                            {nfts.length}
                        </div>
                        <div className={style.statName}>
                            items
                        </div>
                    </div>
                    <div className={style.collectionStat}>
                        <div className={style.statValue}>
                            {collection?.allOwners ? collection.allOwners.length : ""}
                        </div>
                        <div className={style.statName}>
                            owners
                        </div>
                    </div>
                    <div className={style.collectionStat}>
                        <div className={style.statValue}>
                            <img
                                src="/ethereum-eth-logo.svg"
                                alt = "eth"
                                className={style.ethLogo}
                            />
                            {collection?.floorPrice}
                        </div>
                        <div className={style.statName}>
                            floor price
                        </div>
                    </div>
                    <div className={style.collectionStat}>
                        <div className={style.statValue}>
                            <img
                                src="/ethereum-eth-logo.svg"
                                alt = "eth"
                                className={style.ethLogo}
                            />
                            {collection?.volumeTraded}.5K
                        </div>
                        <div className={style.statName}>
                            volume traded
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.midRow}>
                <div className={style.description}>
                    {collection?.description}
                </div>
            </div>
        </div>
            <div className="flex: flex-wrap">
                {/* Hey */}
                {/* {console.log(nfts.length)} */}
                {nfts.map((nftItem, id) => (
                    <NFTCard
                        key={id}
                        nftItem={nftItem}
                        title={collection?.title}
                        listings={listings}
                    />
                ))}
            </div>
        </div>  
    )
}

export default Collection