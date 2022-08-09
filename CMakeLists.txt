project(ncnn-webassembly-yolov5)

cmake_minimum_required(VERSION 3.10)

set(CMAKE_BUILD_TYPE release)

set(RUNTIME_OUTPUT_DIRECTORY  ${PROJECT_SOURCE_DIR}/build/)
set(EXECUTABLE_OUTPUT_PATH  ${PROJECT_SOURCE_DIR}/public/)



# for android
# set(ncnn_DIR "${CMAKE_CURRENT_SOURCE_DIR}/cpp/ncnn/lib/cmake/ncnn")
# find_package(ncnn REQUIRED)

# set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -s FORCE_FILESYSTEM=1 -s INITIAL_MEMORY=256MB -s EXIT_RUNTIME=1")
# set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s FORCE_FILESYSTEM=1 -s INITIAL_MEMORY=256MB -s EXIT_RUNTIME=1")

# set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -fopenmp -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=15")
# set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fopenmp -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=15")
# set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -fopenmp -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=15")

# set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -sEXPORTED_FUNCTIONS=['_yolo_ncnn','_detect_yolo','_free'] --preload-file ${CMAKE_CURRENT_SOURCE_DIR}/cpp/assets@.")
# set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -sEXPORTED_FUNCTIONS=['_yolo_ncnn','_detect_yolo','_free'] --preload-file ${CMAKE_CURRENT_SOURCE_DIR}/cpp/assets@.")
# set(CMAKE_EXECUTBLE_LINKER_FLAGS "${CMAKE_EXECUTBLE_LINKER_FLAGS} -sEXPORTED_FUNCTIONS=['_yolo_ncnn','_detect_yolo','_free'] --preload-file ${CMAKE_CURRENT_SOURCE_DIR}/cpp/assets@.")

# add_executable(duckpuc cpp/duckpuc.cpp)
# target_link_libraries(duckpuc ncnn pthread)

# for ios new
# set(ncnn_DIR "${CMAKE_CURRENT_SOURCE_DIR}/cpp/ncnn-ios-new/lib/cmake/ncnn")
# find_package(ncnn REQUIRED)

# set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -s FORCE_FILESYSTEM=1 -s INITIAL_MEMORY=256MB -s EXIT_RUNTIME=1")
# set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s FORCE_FILESYSTEM=1 -s INITIAL_MEMORY=256MB -s EXIT_RUNTIME=1")

# set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -fopenmp -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=15")
# set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fopenmp -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=15")
# set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -fopenmp -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=15")

# set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -sEXPORTED_FUNCTIONS=['_yolo_ncnn','_detect_yolo','_free'] --preload-file ${CMAKE_CURRENT_SOURCE_DIR}/cpp/assets@.")
# set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -sEXPORTED_FUNCTIONS=['_yolo_ncnn','_detect_yolo','_free'] --preload-file ${CMAKE_CURRENT_SOURCE_DIR}/cpp/assets@.")
# set(CMAKE_EXECUTBLE_LINKER_FLAGS "${CMAKE_EXECUTBLE_LINKER_FLAGS} -sEXPORTED_FUNCTIONS=['_yolo_ncnn','_detect_yolo','_free'] --preload-file ${CMAKE_CURRENT_SOURCE_DIR}/cpp/assets@.")

# add_executable(duckpuc-ios-new cpp/duckpuc-ios-new.cpp)
# target_link_libraries(duckpuc-ios-new ncnn pthread)

# for ios old
set(ncnn_DIR "${CMAKE_CURRENT_SOURCE_DIR}/cpp/ncnn-ios-old/lib/cmake/ncnn")
find_package(ncnn REQUIRED)

set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -s FORCE_FILESYSTEM=1 -s INITIAL_MEMORY=256MB -s EXIT_RUNTIME=1")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s FORCE_FILESYSTEM=1 -s INITIAL_MEMORY=256MB -s EXIT_RUNTIME=1")

set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -sEXPORTED_FUNCTIONS=['_yolo_ncnn','_detect_yolo','_free'] --preload-file ${CMAKE_CURRENT_SOURCE_DIR}/cpp/assets@.")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -sEXPORTED_FUNCTIONS=['_yolo_ncnn','_detect_yolo','_free'] --preload-file ${CMAKE_CURRENT_SOURCE_DIR}/cpp/assets@.")
set(CMAKE_EXECUTBLE_LINKER_FLAGS "${CMAKE_EXECUTBLE_LINKER_FLAGS} -sEXPORTED_FUNCTIONS=['_yolo_ncnn','_detect_yolo','_free'] --preload-file ${CMAKE_CURRENT_SOURCE_DIR}/cpp/assets@.")

add_executable(duckpuc-ios-old cpp/duckpuc-ios-old.cpp)
target_link_libraries(duckpuc-ios-old ncnn)

# debug
# set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -sASSERTIONS")
# set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -sASSERTIONS")


