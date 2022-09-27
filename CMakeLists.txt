project(ncnn-webassembly-yolov5)

cmake_minimum_required(VERSION 3.10)

set(CMAKE_BUILD_TYPE release)

set(RUNTIME_OUTPUT_DIRECTORY  ${PROJECT_SOURCE_DIR}/build/)
set(EXECUTABLE_OUTPUT_PATH  ${PROJECT_SOURCE_DIR}/public/)

option(BUILD_FOR "build for device (android, ios-new, ios-old)" "android")
message(STATUS "build for: ${BUILD_FOR}")

if (BUILD_FOR MATCHES "android")
    # for android
    set(ncnn_DIR "${CMAKE_CURRENT_SOURCE_DIR}/cpp/ncnn-base/lib/cmake/ncnn")
    set(WITH_THREADS true)
elseif(BUILD_FOR MATCHES "ios-new") 
    set(ncnn_DIR "${CMAKE_CURRENT_SOURCE_DIR}/cpp/ncnn-ios-new/lib/cmake/ncnn")
    set(WITH_THREADS true)
elseif(BUILD_FOR MATCHES "ios-old") 
    set(ncnn_DIR "${CMAKE_CURRENT_SOURCE_DIR}/cpp/ncnn-ios-old/lib/cmake/ncnn")
else()
    message( FATAL_ERROR "invalid build for ${BUILD_FOR}" )
endif()

find_package(ncnn REQUIRED)

set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -s FORCE_FILESYSTEM=1 -s INITIAL_MEMORY=256MB -s EXIT_RUNTIME=1")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s FORCE_FILESYSTEM=1 -s INITIAL_MEMORY=256MB -s EXIT_RUNTIME=1")

if (WITH_THREADS)
    message(STATUS "compiling with threads")
    set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -fopenmp -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=15")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fopenmp -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=15")
    set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -fopenmp -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=15")
endif()

set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -sMODULARIZE=1 -sEXPORT_NAME='createYoloModule' -sEXPORTED_FUNCTIONS=['_yolo_ncnn','_detect_yolo','_free'] --preload-file ${CMAKE_CURRENT_SOURCE_DIR}/cpp/assets@.")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -sMODULARIZE=1 -sEXPORT_NAME='createYoloModule' -sEXPORTED_FUNCTIONS=['_yolo_ncnn','_detect_yolo','_free'] --preload-file ${CMAKE_CURRENT_SOURCE_DIR}/cpp/assets@.")
set(CMAKE_EXECUTBLE_LINKER_FLAGS "${CMAKE_EXECUTBLE_LINKER_FLAGS} -sMODULARIZE=1 -sEXPORT_NAME='createYoloModule' -sEXPORTED_FUNCTIONS=['_yolo_ncnn','_detect_yolo','_free'] --preload-file ${CMAKE_CURRENT_SOURCE_DIR}/cpp/assets@.")

# debug
# set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -sASSERTIONS")
# set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -sASSERTIONS")

if (BUILD_FOR MATCHES "android")
    # for android
    add_executable(duckpuc cpp/model-helpers.cpp cpp/model.cpp)
    target_link_libraries(duckpuc ncnn pthread)
elseif(BUILD_FOR MATCHES "ios-new") 
    add_executable(duckpuc-ios-new cpp/model-helpers.cpp cpp/model-ios-new.cpp)
    target_link_libraries(duckpuc-ios-new ncnn pthread)
elseif(BUILD_FOR MATCHES "ios-old") 
    add_executable(duckpuc-ios-old cpp/model-helpers.cpp cpp/model-ios-old.cpp)
    target_link_libraries(duckpuc-ios-old ncnn)
endif()



